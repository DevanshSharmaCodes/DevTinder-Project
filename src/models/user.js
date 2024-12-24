const mongoose=require("mongoose");

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
})

module.exports=mongoose.model("User",userSchema);; 