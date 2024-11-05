// Import the required modules
import express from "express"
const router = express.Router();

// Import the required controllers and middleware functions
import {
  login,
  signup,
  sendotp,
  changePassword,
} from "../controllers/Auth.js"

import {
  resetPasswordToken,
  resetPassword,
} from "../controllers/ResetPassword.js"

import { auth } from "../middlewares/auth.js"


// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
export default router;