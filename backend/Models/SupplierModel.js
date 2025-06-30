const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    supplierName:{ 
        type:String,
        required:true
    },

    companyName:{
        type:String,
        required:true
    },

    phoneNum: {
        type: String,
        required: true,
        unique: true,  // Prevent duplicate numbers
        match: [/^0\d{9}$/, 'Please enter a valid 10-digit phone number'] // Only allows 10-digit numbers
    },

    email: {
        type: String,
        required: true,
        unique: true,  // Prevent duplicate emails
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] // Regex for validation
    },

    paid:{
        type:Boolean,
        required:true
    },

    unitPrice:{
        type:Number,
        required:true
    },

    quantity:{
        type:Number,
        required:true
    },

    totAmount: {
        type: Number,
        required: true       // <-- This is what was missing
      },

    pName:{
        type:String,
        required:true,
    },




}, {timestamps: true})


module.exports = mongoose.model('Supplier', supplierSchema)