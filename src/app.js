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
