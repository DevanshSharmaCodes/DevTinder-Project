const jwt=require("jsonwebtoken");
const User=require("../models/user")
const userAuth=async (req,res,next)=>{
    try {
        //Read the token from req cookies
        const cookies=req.cookies;
        const {token}=cookies;
        if(!token){
            throw new Error("Token is not valid!");
        }
        const decodedObj=await jwt.verify(token,"Dev@Tinder$69");
        const {_id}=decodedObj;
        const user=await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user=user;
        next();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports={
    userAuth, 
}