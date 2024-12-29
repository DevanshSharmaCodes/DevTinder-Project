const validator=require('validator');

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid.");
    }else if(firstName.length<4 || firstName.length>50){
        throw new Error("First name should be 4-50 characters long.")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password.");
    }
}    

const validateEditProfileData=(req)=>{
    const allowedEditFields=["firstName","lastName","emailId","photoUrl","gender","age","about","skills"];
    const isEditAllowed=Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
    return isEditAllowed;
}

const validatePasswordChangeData=(req)=>{
    const {emailId,newPassword}=req.body;
    if(!emailId){
        throw new Error("Email ID is required.");
    }if(!validator.isEmail(emailId)){
        throw new Error("Invalid email address.");
    }if(!newPassword){
        throw new Error("New password is required.");
    }if(!validator.isStrongPassword(newPassword)){
        throw new Error("Please enter a strong password.")
    }
}

module.exports={validateSignUpData,validateEditProfileData,validatePasswordChangeData};