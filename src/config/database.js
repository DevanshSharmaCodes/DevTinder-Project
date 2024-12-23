const mongoose = require('mongoose');
//This is a connection string used to connect to the cluster in MongoDB Atlas. It is a secure way to connect to the database.
const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://devanshmkv2003:Uvxe67nKME1wJcy1@cluster0.pnfke.mongodb.net/DevTinder");
};

module.exports=connectDB;
