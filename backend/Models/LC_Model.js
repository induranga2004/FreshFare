const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Loyal Customer Schema
const LC_Schema= new Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    mobile:{
        type:String,
        required:true
    },

    registeredDate: {
        type: Date,
        default: Date.now
    },

    totalPoints: {
        type: Number,
        default: 0
    },

    lastTransactionDate: {
        type: Date
    },

    totalSpent: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('LC',LC_Schema)
