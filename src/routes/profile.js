const express=require("express");
const profileRouter=express.Router();
const User=require("../models/user")
const bcrypt=require("bcrypt");
const {userAuth}=require("../middlewares/auth"); 
const { validateEditProfileData, validatePasswordChangeData } = require("../utils/validation");

profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try {        
        const user=req.user;//(sent by middleware)
        // console.log("The logged in user is: " + user?.firstName+" "+user?.lastName);
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request.");
        }
        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
        // console.log(loggedInUser); 
        await loggedInUser.save();
        res.send("Profile updated successfully.");
    } catch (error) {
        res.status(400).send(error.message);
    }
})

profileRouter.patch("/profile/password",async(req,res)=>{
    try {
        validatePasswordChangeData(req);
        const{emailId,newPassword}=req.body;
        const user=await User.findOne({emailId});
        if(!user){
            throw new Error("Please sign up.");
        }
        const hashed=await bcrypt.hash(newPassword,10);
        user.password=hashed;
        console.log(user);
        res.send("Password updated successfuly.");
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports=profileRouter;