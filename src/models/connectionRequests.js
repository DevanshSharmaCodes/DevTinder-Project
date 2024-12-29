const mongoose=require("mongoose");
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},{
    timestamps:true,
})


//compund index:
connectionRequestSchema.index({fromUserId:1,toUserId:1});
//makes the queries with fromUserId and toUserId faster.

//We should never use arrow functions with pre or schema methods, as arrow functions do not have their own this keyword. So, we will not be able to access the document or the model inside the arrow function.
connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    //Checking if user is sending request to self(from and to user id are same):
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("User cannot send request to self.");
    }
    next();
})
//pre is a type of middleware in mongoose. It is used to run some code before saving the document to the database. "save" is the event that we are listening to. The function that we pass to pre will run before saving the document to the database.

const ConnectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequestModel;