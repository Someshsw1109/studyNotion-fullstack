import mongoose from "mongoose";
import dotenv from "dotenv";

// Ensure dotenv is loaded
dotenv.config();

const dbConnect = () => {
    try{
        mongoose.connect(process.env.MONGODB_URL);
        console.log("DB connected successfully");
    }
    catch(error){
        console.error("DB connection issue");
        console.error(err);
        process.exit(1);
    }
};
export default dbConnect;
