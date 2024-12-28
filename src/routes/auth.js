const express=require("express")
const authRouter=express.Router();
const {validateSignUpData}=require("../utils/validation");
const User=require("../models/user")
const bcrypt=require("bcrypt");

authRouter.post("/signup",async (req,res)=>{
    try {
        //Validating the data
        validateSignUpData(req);
        
        //Hashing the password
        const {firstName,lastName,emailId,password}=req.body;
        //bcrypt is a library used for hashing passwords
        const passwordHash=await bcrypt.hash(password,10);
        //The second argument of hash (here 10) is the number of salt rounds
        
    // Creating a new instance of the the User model
    //We should never trust req.body as, the user can send any data in the request body. That is why we should validate the data before saving it to the database(as done above).
    const user=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    });
        //Saving the user to the database
        await user.save();
        res.send("User added successfully");    
    } catch (error) {
        res.status(400).send(error.message);
    }
})
 
authRouter.post("/login",async(req,res)=>{
    try {
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials.");
        }
        const isPasswordValid=await user.validatePassword(password);
        if(isPasswordValid){
            //Create a JWT token
            const token=await user.getJWT();
            //  

            //Add the token to cookie and send the response back to the user.
            res.cookie("token",token);
            res.send("Login successfull.");
        }else{
            throw new Error("Invalid credentials.");
        }
    } catch (error) {
        res.status(400).send("Error:"+error.message);
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    res.send("Logout successful");
})

module.exports=authRouter;