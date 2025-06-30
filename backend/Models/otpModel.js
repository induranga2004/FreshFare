const mongoose = require('mongoose');

// OTP Schema
const OTPSchema = new mongoose.Schema({
    
    mobile: { 
        type: String, 
        required: true 
    },
    otp: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
    }
});

module.exports = mongoose.model('OTP', OTPSchema);