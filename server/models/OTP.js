import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js"

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },
});


// function to send emails before creating entry in DB:
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,"verification email from Padhle",otp);
        console.log("Email sent successfully:",mailResponse);
    }catch(error){
        console.log("Error occured while sending mails:",error);
        throw error;
    }
}
OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})


const OTP=mongoose.model("OTP",OTPSchema);
export default OTP;