const express=  require("express");
const requestsRouter=express.Router();
const {userAuth}=require("../middlewares/auth"); 

requestsRouter.post("/sendConnectionRequest",userAuth,(req,res)=>{
    console.log("Sending connection request.");
    res.send("Connection request sent"); 
})

module.exports=requestsRouter;