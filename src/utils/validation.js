const validator=require('validator');

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid.");
    }else if(firstName<4 || firstName>50){
        throw new Error("First name should be 4-50 characters long.")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password.");
    }
}    
    
module.exports={validateSignUpData};