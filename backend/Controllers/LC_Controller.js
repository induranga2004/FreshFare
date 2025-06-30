const LC = require('../Models/LC_Model') //LC Model
const OTP = require('../Models/otpModel');
const Transaction = require('../Models/transaction');
const axios = require('axios');

// Send OTP (no customer saved yet)
const sendOtp = async (req, res) => {
    
    const { mobile } = req.body;

    try {


        // Check mobile number in existing list

        let num = await LC.findOne({mobile})

        if(num){
            return res.status(500).json({ message: "Customer is already registerd" })
        }
        


        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit otp

        // Save OTP to DB
        await new OTP({ mobile, otp }).save();

        // Send OTP via Text.lk
        await axios.post('https://app.text.lk/api/v3/sms/send', {
            
            sender_id:'TextLKDemo',
            recipient: `94${mobile.slice(1)}`,
            message: `Your OTP is ${otp} for registering as a Loyal Customer of FreshFare`,
            sender_id: "TextLKDemo",
            type:'plain',
            
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer 424|wKzC4qh8Bxeh6CSmd8oQX2vnuXAB99DiUUZbUvec60d7ff64 '
            }
        });

        return res.status(200).json({ message: "OTP Sent!" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error sending OTP" });
    }
};


// Add customer with OTP verify

const verifyOtpAndAddLC = async (req, res) => {
    const { name, email, mobile, otp } = req.body;

    try {
        // Verify OTP
        const validOtp = await OTP.findOne({ mobile, otp });

        if (!validOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Check if OTP is expired (60 seconds)
        const otpCreatedTime = validOtp.createdAt;
        const currentTime = new Date();
        const timeDifference = (currentTime - otpCreatedTime) / 1000; // in seconds

        if (timeDifference > 60) {
            // Delete expired OTP
            await OTP.deleteOne({ _id: validOtp._id });
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        // Delete OTP after successful verification
        await OTP.deleteOne({ _id: validOtp._id });

        // Add Customer to DB
        const lc = new LC({ name, email, mobile });
        await lc.save();

        await axios.post('https://app.text.lk/api/v3/sms/send', {
            sender_id:'TextLKDemo',
            recipient: `94${mobile.slice(1)}`,
            message: `Thank you ${name} for Registering with us, Now you can enjoy all Discounts and Benifits of FreshFare Loyal Customer`,
            sender_id: "TextLKDemo",
            type:'plain',
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer 424|wKzC4qh8Bxeh6CSmd8oQX2vnuXAB99DiUUZbUvec60d7ff64 '
            }
        });

        return res.status(200).json({ message: "Customer added after OTP verification!", lc })
    } 
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error verifying OTP or adding customer" });
    }
};

// Get all loyal customers
const getAllLC = async (req, res) => {
    try {
        const customers = await LC.find();
        return res.status(200).json({ LCs: customers });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching customers" });
    }
};

//Get Loyal Customer by ID

const getLC = async (req,res,next) => {

    const id = req.params.id

    let lc 

    try{
        lc = await LC.findById(id)

    }
    catch(err){
        console.log(err)
    }

    if(!lc){
        return res.status(404).json({message:"Customer Not Found"})
    }

    return res.status(200).json({lc})

}


//Update Customer details

const updateLC = async (req,res,next)=>{

    const id = req.params.id

    const {name,email,mobile}= req.body

    let lc

    try{
        
        lc = await LC.findByIdAndUpdate(id,{name:name, email:email,mobile:mobile})

        lc = await lc.save()

    }
    catch(err){
        console.log(err)
    }

    if(!lc){
        return res.status(404).json({message:"Unable to Update Customer"})
    }

    return res.status(200).json({lc})

}



//Delete Loyal customer

const deleteLC = async (req,res)=>{

    const id = req.params.id

    let lc

    try{
        lc = await LC.findByIdAndDelete(id)
    }
    catch(err){
        console.log(err)
    }

    if(!lc){
        return res.status(404).json({message:"Unable to delete Customer"})
    }

    return res.status(200).json({lc})

}

// Calculate and update points for a transaction
const calculatePoints = async (req, res) => {
    const { customerId, amount } = req.body;
    
    try {
        const customer = await LC.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        let pointsEarned = 0;
        if (amount >= 1000 && amount <= 10000) {
            pointsEarned = Math.floor(amount / 100);
        } else if (amount > 10000) {
            pointsEarned = 300;
        }

        // Update customer points and spending
        customer.totalPoints = (customer.totalPoints || 0) + pointsEarned;
        customer.totalSpent = (customer.totalSpent || 0) + amount;
        customer.lastTransactionDate = new Date();
        
        // Save customer updates
        await customer.save();

        // Create transaction record
        const transaction = new Transaction({
            TotalPrice: amount,
            Customer_payment: amount,
            Balance: 0,
            customerId: customer._id,
            pointsEarned: pointsEarned,
            totalPoints: customer.totalPoints
        });
        await transaction.save();

        return res.status(200).json({
            success: true,
            pointsEarned,
            totalPoints: customer.totalPoints,
            message: "Points calculated and updated successfully"
        });
    } catch (error) {
        console.error('Error in calculatePoints:', error);
        return res.status(500).json({ 
            success: false,
            message: "Error calculating points",
            error: error.message 
        });
    }
};

// Get customer's current points
const getPoints = async (req, res) => {
    const { id } = req.params;
    
    try {
        const customer = await LC.findById(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        return res.status(200).json({
            totalPoints: customer.totalPoints,
            totalSpent: customer.totalSpent,
            lastTransactionDate: customer.lastTransactionDate
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching points" });
    }
};

// Get customer's transaction history
const getTransactionHistory = async (req, res) => {
    const { id } = req.params;
    
    try {
        const transactions = await Transaction.find({ customerId: id })
            .sort({ Transaction_time: -1 });
        
        return res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching transaction history" });
    }
};

module.exports = {
    sendOtp,
    verifyOtpAndAddLC,
    getAllLC,
    getLC,
    updateLC,
    deleteLC,
    calculatePoints,
    getPoints,
    getTransactionHistory
};

