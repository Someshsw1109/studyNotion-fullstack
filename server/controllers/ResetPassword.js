import User from "../models/User.js"
import mailSender from "../utils/mailSender.js"
import bcryptjs from "bcryptjs"
import crypto from "crypto"
// resetPasswordToken
const resetPasswordToken=async(req,res)=>{
    try{
        // get email from req body
    const {email}=req.body;
    // check user for this email,email validation
    const user=await User.findOne({email:email});
    if(!user){
        return res.json({
            success:false,
            message:"your email is not registered with us",
        })
    }

    // generate token
    const token=crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails=await User.findOneAndUpdate({email:email},{
        token:token,
        resetPasswordExpires:Date.now()+5*60*1000,
    },{new:true});
    // new se updated document return hota hai.




    // create url
    const url=`https://localhost:3000/update-password/${token}`

    // send mail containing the url
    await mailSender(email,`Password Reset Link","Password Reset Link:${url}`);

    // return response
    return res.json({
        success:true,
        message:"Email sent successfully",
    })
}catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"something went wrong while reset",
    })
}
}
export {resetPasswordToken}




// resetPassword
const resetPassword=async(req,res)=>{
    // data fetch
   try{
    const {password,confirmPassword,token}=req.body;

    // validation
    if(password!==confirmPassword){
        return res.json({
            success:false,
            message:"password not matching",
        })
    }
    
    // password is matched now check this user is valid/not:- get user details from DB 
    const userDetails=await User.findOne({token:token});

    // if no entry-invalid token
    if(!userDetails){
        return res.json({
            success:false,
            message:"Token is invalid",
        });
    }
    // token expires check
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.json({
            success:false,
            message:"Token is expired,please regenerate your token",
        })
    }





    // hash password
    const hashedPassword=await bcryptjs.hash(password,10);


    // update password
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    );
    // return response
    return res.status(200).json({
        success:true,
        message:"Password reset successful."
    })
   }
   catch(error){
    return res.status(500).json({
        success:false,
        message:"something went wrong while sendign reset password mail"
    })
   }
}
export {resetPassword}