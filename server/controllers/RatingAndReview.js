import RatingAndReview from "../models/RatingAndReview.js"
import Course from "../models/Course.js"
import mongoose from "mongoose";


// create Rating
const createRating=async(req,res)=>{
    try{
        // get userid: auth wale middleware mai req ke saath payload ko link kiya tha, isliye req.user.id
        const {userId}=req.user.id;

        // fetch data from req body
        const {rating,review,courseId}=req.body;

        // check if user is enrolled or not
        const courseDetails=await Course.findById(
            {_id:courseId,
                studentsEnrolled:{$elemMatch:{$eq:userId}}
            });


            if(!courseDetails){
                return res.status(404).json({
                    success:false,
                    message:"student is not enrolled in this course",
                })
            }

        // check if user already reviewed the course
        const alreadyReviewed=await RatingAndReview.findOne({
            user:userId,
            course:courseId,
        })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"course is already reviewed by the user",
            })
        }

        // create rating and review
        const ratingReview=await RatingAndReview.create({
            rating,review,course:courseId,user:userId,
        });

        // update the course with rating and review
        const updatedCoursesDetails=await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    ratingAndReviews:ratingReview._id,
                }
            },{new:true})
            console.log(updatedCoursesDetails);


        // return response
        return res.status(200).json({
            success:true,
            message:"rating and review created successfully",
            ratingReview,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
export {createRating}











// getAverageRating
const getAverageRating=async(req,res)=>{
    try{
        // get course id
        const courseId=req.body.courseId;

        // calculate average rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    // courseId string hai usko objectid mai convert kro.
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            },
        ])

        // return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }


        // if no rating/review exit
        return res.status(200).json({
            success:true,
            message:"Average rating is 0,no rating given till now",
            averageRating:0,
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
export {getAverageRating}













// getAllRating
const getAllRating=async(req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName email",
        }).populate({
            path:"course",
            select:"courseName",
        })
        .exec();
        return res.status(200).json({
            success:true,
            message:"All reviws fetched successfully",
            data:allReviews,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
export {getAllRating}