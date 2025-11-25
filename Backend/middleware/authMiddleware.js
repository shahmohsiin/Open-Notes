const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

const VerifyToken = (req,res,next)=>{

    
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"no token provided"});
    }

    try {
        const decoded= jwt.verify(token,process.env.SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({message:"invalid token "})
    }
}

module.exports = VerifyToken;