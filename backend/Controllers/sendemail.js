const {transporter} = require("../configuration/nodemailer")
const sendEmail = async(req,res)=>{
    const {password,email} = req.body;
    const mainOptions = {
                        from:process.env.SENDER_EMAIL,
                        to:email,
                        subject:"Reset Password",
                        html:`Your new password is ${password}`
                    }
    await transporter.sendMail(mainOptions)
}
module.exports={sendEmail}