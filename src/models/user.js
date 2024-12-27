const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address" + value);
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid gender data.");
            }
        }
        //By default, the validate function will only run when we are adding a new user, and will not run when updating the details of an existing user. To run the validation even on updating the details of an existing user, we must use the "runValidators" option in the findByIdAndUpdate().
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL"+value);
            }
        }
    },
    about:{
        type:String,
        default:"Hey there! I am using DevTinder",
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true,
    //This will add createdAt and updatedAt fields to the schema.
})

//****** never use arrow functions in the code below, because this keyword cannot work with arrow fn ******
userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:this._id},"Dev@Tinder$69");
    return token;
}
//this is known as schema method

userSchema.methods.validatePassword=async function(passwordInputByUser){
    const user=this;
    const passwordHash=user.password;
    const isPasswordValid=bcrypt.compare(passwordInputByUser,passwordHash);
    return isPasswordValid;

}

module.exports=mongoose.model("User",userSchema);; 