import User from "../models/User.js"
import OTP from "../models/OTP.js"
import otpgenerator from "otp-generator"
import bcryptjs from "bcryptjs"
import Profile from "../models/Profile.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import mailSender from "../utils/mailSender.js"
import passwordUpdated from "../mail/templates//passwordUpdate.js"
dotenv.config();
import otpTemplate from "../mail/templates/emailVerificationTemplate.js"

// sendOTP
const sendotp = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if user already exists
      const checkUserPresent = await User.findOne({ email });
  
      if (checkUserPresent) {
        return res.status(401).json({
          success: false,
          message: "User already registered",
        });
      }
  
      // Generate OTP
      let otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      console.log("OTP generated:", otp);
  
      // Check for unique OTP
      let result = await OTP.findOne({ otp });
      console.log("Result is Generate OTP Func");
      console.log("OTP", otp);
      console.log("Result", result);
  
      while (result) {
        otp = otpgenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        result = await OTP.findOne({ otp });
      }
  
      // Store the OTP to DB
      const otpPayload = { email, otp };
      const otpBody = await OTP.create(otpPayload);
      console.log("OTP body:", otpBody);
  
      // Send OTP via email
      try {
        const emailResponse = await mailSender(email, "OTP Verification", otpTemplate(otp));
        console.log("OTP email sent successfully", emailResponse.response);
      } catch (error) {
        // Cleanup OTP if sending email fails
        await OTP.deleteOne({ otp: otpBody.otp });
        console.error("Error sending OTP email:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP email",
          error: error.message,
        });
      }
  
      // Return response
      res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
export {sendotp}  


// signup
const signup=async(req,res)=>{
    // data fetch from request ki body
    //console.log("try ke andr aaya:");
    try{
        
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        }=req.body;
    
        // validate krlo
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:'All fields are required',
            })
        }
    
        // 2 password match krlo
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and confirmPassword value does not match,please try again'
            })
        }
    
    
        // check user already exist or not
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            })
        }
    
    
        // find most recent otp stores for the user
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
    
        // validate otp
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"The otp is not valid",
            })
        }else if(otp!=recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:'OTP is invalid',
            });
        }
    
        // hash password
        const hashedPassword=await bcryptjs.hash(password,10);
    
        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

		// Create the Additional Profile For User
        const profileDetails=await Profile.create({
            gender:null,
            dob:null,
            about:null,
            contactNumber:null,
        })
    
        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails,
            image:`https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`,
        })

        // return res
        return res.status(200).json({
            success:true,
            message:'User is registered successfully',
            user,
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User cannot be registered.Please try again",
        })
    }
}
export {signup};



// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, please try again",
            });
        }

        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first",
            });
        }

        if (await bcryptjs.compare(password, user.password)) {
            // password is same so generate token for the user.
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            // token generation,which will expires in 2h:
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 34 * 60 * 60 * 1000),
                httpOnly: true,
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'Logged in successfully',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login.",
        });
    }
};
export {login}



// ChangePassword
const changePassword=async(req,res)=>{
    // get data from req body
    try{
        
    const userDetails=await User.findById(req.user.id);
    

    // get oldpassword,newpassword,confirmpassword
    const {oldPassword,newPassword,confirmPassword}=req.body;
    console.log("new and confirm:",newPassword,confirmPassword);
    // validation
    const isPasswordMatch=await bcryptjs.compare(
        oldPassword,
        userDetails.password
    );
    
    if(!isPasswordMatch){
        return res.status(401).json({
            success:false,
            message:"The password is incorrect",
        })
    }

    if(oldPassword===newPassword){
        return res.status(400).json({
            success:false,
            message:"new password cannot be same as old password",
        })
    }

    if (newPassword !== confirmPassword) {
        // If new password and confirm new password do not match, return a 400 (Bad Request) error
        return res.status(400).json({
            success: false,
            message: "The newPassword and confirm password does not match",
        });
    }

    // update pwd in DB
    const encryptedPassword=await bcryptjs.hash(newPassword,10);
    const updatedUserDetails=await User.findByIdAndUpdate(
        req.user.id,
        {password:encryptedPassword},
        {new:true},
    )


    // send mail of updated password:
    try{
        const emailResponse=await mailSender(
            updatedUserDetails.email,
            "Padhle-Password Updated",
            passwordUpdated(
                updatedUserDetails.email,`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
        );
        console.log("Email sent successfully",emailResponse.response);
    }
    catch(error){
        console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
    }

    // return response
    return res.status(200).json({
        success:true,
        message:"Password updated successfully",
    })
}catch(error){
    console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
}
}
export {changePassword}
