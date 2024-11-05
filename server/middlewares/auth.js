import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();


// auth(to check json token)
const auth = async (req, res, next) => {
    console.log("Auth middleware triggered"); 
    try {
        
        const token = req.cookies.token || req.body.token || req.header("Authorisation")?.replace("Bearer ", "");
        if (!token) {
            console.log("No token provided"); 
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }
        console.log("token aagya auth ka:");
        try {
            console.log("auth try chl rha hai:");
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log("JWT Secret:", process.env.JWT_SECRET);
            console.log("Token decoded successfully:", decode); 
            req.user = decode;
        } catch (err) {
            console.log("Invalid token"); 
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
        next(); // Passing control to the next middleware
    } catch (error) {
        console.log("Error in auth middleware:", error); // Debugging line
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating",
        });
    }
}
export {auth}








// isStudent
const isStudent=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students only",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verifies,please try again",
        })
    }
}
export {isStudent}








// isInstructor
const isInstructor=async(req,res,next)=>{
    try{
        console.log("User accountType:", req.user.accountType);
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for instructor only",
            })
        }
        console.log("instructor ka try chl rh hai");
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verifies,please try again",
        })
    }
    
}
export {isInstructor}








// isAdmin
const isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin only",
            })
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verifies,please try again",
        })
    }
}
export {isAdmin}