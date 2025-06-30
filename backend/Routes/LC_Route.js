const express = require("express")
const router = express.Router();

// Insert Model
const LC_Model = require("../Models/LC_Model")

//Insrt Controller
const LC_Controller = require('../Controllers/LC_Controller')

// OTP Routes
router.post('/send-otp', LC_Controller.sendOtp);
router.post('/verify-otp-add', LC_Controller.verifyOtpAndAddLC);

// Customer Management Routes
router.get("/", LC_Controller.getAllLC);
router.get("/:id", LC_Controller.getLC);
router.put("/:id", LC_Controller.updateLC);
router.delete("/:id", LC_Controller.deleteLC);

// Points Management Routes
router.post('/calculate-points', LC_Controller.calculatePoints);
router.get('/:id/points', LC_Controller.getPoints);
router.get('/:id/transactions', LC_Controller.getTransactionHistory);

 //export
 module.exports=router


