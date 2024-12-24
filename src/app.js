const express=require('express');
const connectDB=require("./config/database");
const User=require("./models/user")
const app=express();

// app.get("/",(req,res)=>{
//     //this is a route handler
//     res.send("Hello from server dashboard...");
// })

// app.get("/test", (req,res)=>{
//     //this is a route handler
//     res.send("Hello from server test...");
// })

// app.get("/ek", (req,res)=>{
//     //this is a route handler
//     res.send("Hello from server ek...");
// })

//do not use multiple app.use as it will match to  all the routes having the specified path, irrespective of exact match. Instead use app.get, app.post, app.put, app.delete etc.

app.use(express.json());
//This is a middleware that parses the incoming request across all routes with JSON payloads. It is used to parse the incoming request body and store it in req.body. Otherwise, req.body will be undefined.

//Fetching details of a single user:
app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;
    try {
        const user=await User.find({emailId:userEmail})
        //The name of the key should match the name of the field in the database.
        //This will fetch the user from the database based on the emailId provided in the request body.User.find returns a promise which is resolved when the user is fetched from the database.
        if(user.length===0){
            res.status(404).send("User not found");
        } else{
            res.send(user);
        }
    } catch (error) {
        res.status(400).send("Error while fetching user");
    }
})

//Fetching details of all users:
app.get("/feed",async(req,res)=>{
    try {
        const users=await User.find({})
        res.send(users);
    } catch (error) {
        res.status(400).send("Error while fetching users");
    }
})

//Deleting a user by ID:
app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    //The ID of the user to be deleted is provided in the request body. 
    try {
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(400).send("Error while deleting user");
    }
})

//Updating a user by ID:
app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    try {
        const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"]
        const isUpdateAllowed=Object.keys(data).every((update)=>ALLOWED_UPDATES.includes(update));
        if(!isUpdateAllowed){
            throw new Error("Updates not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("Skills cannot be more than 10");
        }
        //Above we have applied API validation.
        await User.findByIdAndUpdate({_id:userId},data,{runValidators:true});
        //here data can contain multiple fields to be updated, even those which are not present in our schema(like userId). So, MongoDB will ignore the fields which are not present in the schema and update only the fields which are present.
        res.send("User updated successfully");
    } catch (error) {
        res.status(400).send("Error while updating user");
    }
})

app.post("/signup",async (req,res)=>{
    // Creating a new instance of the the User model
    const user=new User(req.body);
    try {
        //Saving the user to the database
        await user.save();
        res.send("User added successfully");    
    } catch (error) {
        res.status(400).send("Error while adding user");
    }
})

connectDB().then(()=>{
    console.log("Database connection successful");
    app.listen(3000,()=>{
        console.log("Server is running on port 3000");
    })
    //Server starts listening only when the DB connection is established.
}).catch((err)=>{
    console.log("Connection failed");
})

// app.listen(3000,()=>{
//     console.log("Server is running on port 3000");
// })
// Moved this code inside the connectDB function to ensure that the server starts only when the DB connection is established. This is done using the .then() and .catch() methods. The .then() method is called when the connection is successful and the .catch() method is called when the connection fails.

