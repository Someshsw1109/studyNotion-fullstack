import express from "express"
const app=express();
import userRoutes from "./routes/User.js"
import paymentRoutes from "./routes/Payment.js"
import profileRoutes from "./routes/Profile.js"
import CourseRoutes from "./routes/Course.js"
import dbConnect from "./config/db.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import fileUpload from "express-fileupload"
import cloudinaryconnect from "./config/Cloudinary.js"
import dotenv from "dotenv"
dotenv.config();


const PORT = process.env.PORT || 5000;
dbConnect();

// parse incoming request with json body and make it available to req.body
app.use(express.json());

//when we login,this request have cookie so to access/to make available this cookie we use it.
app.use(cookieParser());

// CORS is used to interact frontend and backend hosted at different port/domain.
// When your frontend (React) makes an API request to the backend (Express) using Axios (or any other HTTP client),
// this is considered a cross-origin request. The browser will block this request unless the backend explicitly allows it through CORS.

const allowedOrigins = [
  "http://localhost:5173", // Add the frontend's origin
  "http://localhost:3000", // Keep existing origin if necessary
];

app.use(cors({
  origin: allowedOrigins, 
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
  credentials: true 
}));



// allow server to accept and manage files uploaded by client through HTML form or API request.
app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
}));

// connection with cloudinary:
  cloudinaryconnect();
  

  // routes:
  app.use("/api/v1/auth", userRoutes); 
  app.use("/api/v1/payment", paymentRoutes);
  app.use("/api/v1/profile", profileRoutes);
  app.use("/api/v1/course", CourseRoutes);
  // app.use("/api/v1/contact", require("./routes/ContactUs"));


  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to the API",
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

