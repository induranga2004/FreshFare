const transaction = require("../Models/transaction")
require("dotenv").config();
const {transporter} = require("../configuration/nodemailer")

const createtransaction = async(details) =>{
    const {TotalPrice,Customer_payment,Balance,email} = details;
    if(TotalPrice>Customer_payment)
    {
        throw new Error("Customer payment is less than total price");
    }
    if(!TotalPrice || !Customer_payment || !Balance)
    {
        throw new Error("All fields are required");
    }
    else
    {
        const newtransaction =new transaction({
            TotalPrice,
            Customer_payment,
            Balance
        })
        await newtransaction.save();
        const mainOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"FRESHFARE Payment Successfull",
            html:`<p>Total Price : ${TotalPrice}</p><p>Customer Payment : ${Customer_payment}</p><p>Balance : ${Balance}</p>`
        }
        await transporter.sendMail(mainOptions)
    }
}

const getDailyTransactions = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyTransactions = await transaction.aggregate([
        {
            $match: {
                Transaction_time: {
                    $gte: today,
                    $lt: tomorrow
                }
            }
        },
        {
            $project: {
                TotalPrice: 1,
                Customer_payment: 1,
                Balance: 1,
                Transaction_time: 1,
                payment_method: {
                    $cond: {
                        if: { $eq: ["$payment_type", "card"] },
                        then: "Credit Card",
                        else: "Cash"
                    }
                }
            }
        }
    ]);

    return dailyTransactions;
};

module.exports = {createtransaction, getDailyTransactions}