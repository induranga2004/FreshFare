const express = require('express')
const { login, resetPassword, verifyotp, getemail }  = require('../Controllers/authController.js');
const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/acceptEmail', getemail);
authRouter.post('/verifyotp',verifyotp)
authRouter.post('/reset-password', resetPassword);


module.exports =  authRouter;

