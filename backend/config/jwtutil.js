const jwt = require("jsonwebtoken")
const dotenv =  require("dotenv")
dotenv.config();
const secretkey = process.env.JWT_SECRET;
const generateToken = (user) =>{
    const payload = {
        id:user._id,
        role:user.role
    }
    const token = jwt.sign(payload,secretkey,{expiresIn:"24h"})
    const role = user.role;
    return({
        newtoken:token,
        role:role
    })
}
module.exports = {generateToken}
