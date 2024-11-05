import mongoose from "mongoose";

const courseprogressSchema=new mongoose.Schema({
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },

    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection"
        }
    ]
});
const courseProgress=mongoose.model("CourseProgress",courseprogressSchema);
export default courseProgress;