const jwt = require("jsonwebtoken");
const {secretkey}  = require("../configuration/jwtConfig")

const authtransaction = (req,res,next) =>{
    const authHeader = req.header("Authorization");
    if(!authHeader) {
        return res.status(401).json({message:"Unauthorized:missing token"});
    }

    const [bearer,token] = authHeader.split(" ");
    if(bearer !=="Bearer" || !token) {
        return res.status(401).json({message:"unauthorized:Invalid token format"});
    }

    jwt.verify(token,secretkey,(err,payload)=>{
        if(err) {
            return res.status(403).json({message:"Forbidden: Invalid token"});
        }
        
        const role = payload.role;
        if(role === "Cashier") {
            // For POST requests, validate and set body
            if (req.method === "POST") {
                const { TotalPrice, Customer_payment, Balance, email } = req.body;
                req.body = {
                    TotalPrice,
                    Customer_payment,
                    Balance,
                    email
                };
            }
            next();
        } else {
            return res.status(403).json({message:"UNAUTHORIZED: Cashier role required"});
        }
    });
}

module.exports = {authtransaction}