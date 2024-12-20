const express=require('express');
const app=express();

app.get("/",(req,res)=>{
    res.send("Hello from server dashboard...");
})//this is a request handler

app.get("/test", (req,res)=>{
    res.send("Hello from server test...");
})//this is a request handler

app.get("/ek", (req,res)=>{
    res.send("Hello from server ek...");
})//this is also a request handler

//do not use multiple app.use as it will match to  all the routes having the specified path, irrespective of exact match. Instead use app.get, app.post, app.put, app.delete etc.

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})