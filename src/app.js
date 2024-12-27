const express=require('express');
const connectDB=require("./config/database");
const User=require("./models/user")
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken"); 
const {userAuth}=require("./middlewares/auth"); 

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
app.use(cookieParser());
//This is a middleware that parses the incoming request across all routes with JSON payloads. It is used to parse the incoming request body and store it in req.body. Otherwise, req.body will be undefined.

// //Fetching details of a single user:
// app.get("/user",async(req,res)=>{
//     const userEmail=req.body.emailId;
//     try {
//         const user=await User.find({emailId:userEmail})
//         //The name of the key should match the name of the field in the database.
//         //This will fetch the user from the database based on the emailId provided in the request body.User.find returns a promise which is resolved when the user is fetched from the database.
//         if(user.length===0){
//             res.status(404).send("User not found");
//         } else{
//             res.send(user);
//         }
//     } catch (error) {
//         res.status(400).send("Error while fetching user");
//     }
// })

// //Fetching details of all users:
// app.get("/feed",async(req,res)=>{
//     try {
//         const users=await User.find({})
//         res.send(users);
//     } catch (error) {
//         res.status(400).send("Error while fetching users");
//     }
// })

// //Deleting a user by ID:
// app.delete("/user",async(req,res)=>{
//     const userId=req.body.userId;
//     //The ID of the user to be deleted is provided in the request body. 
//     try {
//         await User.findByIdAndDelete(userId);
//         res.send("User deleted successfully");
//     } catch (error) {
//         res.status(400).send("Error while deleting user");
//     }
// })

// //Updating a user by ID:
// app.patch("/user/:userId",async(req,res)=>{
//     const userId=req.params?.userId;
//     const data=req.body;
//     try {
//         const ALLOWED_UPDATES=["photoUrl","about","gender","age","skills"]
//         const isUpdateAllowed=Object.keys(data).every((update)=>ALLOWED_UPDATES.includes(update));
//         if(!isUpdateAllowed){
//             throw new Error("Updates not allowed");
//         }
//         if(data?.skills.length>10){
//             throw new Error("Skills cannot be more than 10");
//         }
//         //Above we have applied API validation.
//         await User.findByIdAndUpdate({_id:userId},data,{runValidators:true});
//         //here data can contain multiple fields to be updated, even those which are not present in our schema(like userId). So, MongoDB will ignore the fields which are not present in the schema and update only the fields which are present.
//         res.send("User updated successfully");
//     } catch (error) {
//         res.status(400).send("Error while updating user");
//     }
// })

app.post("/signup",async (req,res)=>{
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

app.post("/login",async(req,res)=>{
    try {
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid credentials.");
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            //Create a JWT token
            const token=await jwt.sign({_id:user._id},"Dev@Tinder$69");
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

//userAuth middleware is added in profile api=> at first userAuth middleware runs, if everything runs fine then next() is called from the userAuth middleware and the code inside profile api runs, else if the token is not valid(checked by userAuth), then none of the code present in profile api is run. 
app.get("/profile",userAuth,async(req,res)=>{
    try {
        // const cookies=req.cookies;
        // const {token}=cookies;
        // if(!token){
        //     throw new Error("Invalid token");
        // }
    
        // //Validating the token
        // const decodedMessage=await jwt.verify(token,"Dev@Tinder$69");
        // // console.log(decodedMessage);
        // const {_id}=decodedMessage;
        // const user=await User.findById(_id);
        //As all this above code has now been taken care of in the userAuth middleware, thus commented out 
        const user=req.user;//(sent by middleware)
        // console.log("The logged in user is: " + user?.firstName+" "+user?.lastName);
        res.send("Reading cookie");
    } catch (error) {
        res.status(400).send(error.message);
    }
})

app.post("/sendConnectionRequest",userAuth,(req,res)=>{
    console.log("Sending connection request.");
    res.send("Connection request sent"); 
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

