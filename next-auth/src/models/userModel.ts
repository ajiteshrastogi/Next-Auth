import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    FullName: {
        type : String,
        required : [true, "Enter your Full Name Here"],
    },
    email: {
        type: String,
        required : [true, "Enter your E-Mail Here"],
        unique : true
    },
    password : {
        type : String,
        required: [true, "Enter Your Password"],
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    isAdmin : {
        type: Boolean,
        default : false
    },
    forgetPasswordToken : String,
    forgetPasswordTokenExpiry : Date,
    verifyToken : String,
    verifyTokenExpiry : Date,
})

const User = mongoose.models.users || mongoose.model("User", userSchema);
export default User;