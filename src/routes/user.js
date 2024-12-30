const express=require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User=require("../models/user")
const userRouter=express.Router();

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const connectionRequests=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested",
        }).populate("fromUserId",["firstName","lastName"]);//first name and last name of the users will be fetched from the user collection

        res.json({
            message:"Data fetched successgfully.",
            data:connectionRequests,
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
    
        const connectionRequests=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ]
        }).populate("fromUserId",["firstName","lastName"]).populate("toUserId",["firstName","lastName"]);
        const data=connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user;
        const page=parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;
        //Find out all the connection requests(sent+received)
        const connectionRequests=await ConnectionRequest.find({
            $or:[{fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}]
        }).select("fromUserId toUserId");//Displays only these 2 fields.
        const hideUsersFromFeed=new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })
        const users=await User.find({
            $and:[
                {_id:{$nin:Array.from(hideUsersFromFeed)}},
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select("firstName lastName age photoUrl gender about skills").skip(skip).limit(limit);//skip and limit are used for pagination
    } catch (error) {
        res.status(400).json({message:error.message});
    }
})

module.exports=userRouter;