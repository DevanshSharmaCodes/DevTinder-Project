const express=  require("express");
const requestsRouter=express.Router();
const {userAuth}=require("../middlewares/auth"); 
const User=require("../models/user");
const ConnectionRequest = require("../models/connectionRequests");

requestsRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
    try {
        const fromUserId=req.user._id;//ID of the user who is sending the request(logged in user)
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: "+status});
        }

        //Whether user is sending connection request to self:Not required to check here as is handled by schema pre.(check schema)(We could have also checked here)

        //Whether the user(toUserId) is present in the database or not:
        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"User not found."});
        }

        //If there is an existing connection request:
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[{fromUserId,toUserId},
                 {fromUserId:toUserId,toUserId:fromUserId}
                ],
        });
        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection request already exists."});
        }
        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });//creating a new instance of the ConnectionRequest model
        const data=await connectionRequest.save();//saving the connection request to the database
        res.json({
            message:"Connection request sent successfully.",
            data,
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
})

module.exports=requestsRouter;