const mongoose = require("mongoose");
const transaction = new mongoose.Schema({
    TotalPrice:{
        type:Number,
        Required:true
    },
    Customer_payment:{
        type:Number,
        Required:true
    },
    Balance:{
        type:Number,
        Required:true
    },
    Transaction_time:{
        type:Date,
        default:Date.now()
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LC'
    },
    pointsEarned: {
        type: Number,
        default: 0
    },
    totalPoints: {
        type: Number,
        default: 0
    }
})
module.exports = mongoose.model("transaction",transaction);