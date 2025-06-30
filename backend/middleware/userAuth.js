const jwt  = require('jsonwebtoken');

const userAuth = async (req, res, next)=>{
   
    const {email,password} = req.body;
    

    try {
       
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        
    } catch (error) {
        res.json({success: false, message: error.message });
    }
}

module.exports =  userAuth;