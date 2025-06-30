const bcrypt   = require("bcrypt")
const  userModel  = require("../Models/Employee.js");
const {transporter}  = require("../configuration/nodemailer.js");
const {generateToken}   = require("../config/jwtutil.js");
const dotenv = require("dotenv")
dotenv.config()



const login = async (req, res )=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Email and password are required'})
    }

    
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'Invalid Email'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message: 'Invalid Password'})
        }
        const token = generateToken(user);
        const {newtoken,role} = token;
        return res.json({success:true,token:newtoken,role:role});

    } catch (error) {
         return res.json({success: false, message: error.message});
    }
}



const verifyotp = async(req,res) =>{
    const {email,otp} = req.body;
    const existinguser = await userModel.findOne({email});
    if(!existinguser)
    {
       return res.status(404).json({message:"User is not exist"});
    }
    else{
        const databaseotp = existinguser.verifyOtp;
        if(otp !== databaseotp || otp === '')
        {
                return res.status(404).json({message:"Otp is not valid"});
        }
        if(Date.now()>existinguser.verifyOtpExpireAt)
        {
            return res.status(404).json({message:"OTP is expired"});
        }
        else
        {
            existinguser.verifyOtpExpireAt = 0
            existinguser.verifyOtp = ""
            await existinguser.save();
            return res.status(200).json({message:"Otp is valid"})
        }
    }
}

const getemail =async (req,res)=>{
    const {email} = req.body;
    try{
    const existinguser = await userModel.findOne({email});
    if(existinguser)
    {
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        existinguser.verifyOtp = otp;
        existinguser.verifyOtpExpireAt = Date.now()+1*60*60*1000
        await existinguser.save()
        const mainOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Reset password OTP",
            text:`Your otp is ${otp},use this otp to reset your password`
        }
        await transporter.sendMail(mainOptions)
        return res.status(200).json({message:"We send otp to your email"})
    }
    }catch(error)
    {
        console.log(error.message);
    }
}
const resetPassword = async(req, res)=>{
    const{email, newPassword} = req.body;

    if(!email || !newPassword){
        return res.json({success: false, message: 'Email, OTP and new password are required'});

    }

    try {
       
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: 'User not found'});
        }
        
        

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        return res.json({success: true, message: 'Password has been reset successfully'});
        
    } catch (error) {
        return res.json({success: false, message: error.message});
    }
}

module.exports = {login,verifyotp,getemail,resetPassword}