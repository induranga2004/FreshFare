const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    mobile: { type: String, required: true },
    role:{type:String,required:true,enum:["Owner","Cashier","Manager"],default:"Cashier"},
    password:{type:String,required:true},
    verifyOtp: {type: String, defult: ''},
    verifyOtpExpireAt: {type: Number, defult: 0}
});

module.exports = mongoose.model("Employee", employeeSchema);

 