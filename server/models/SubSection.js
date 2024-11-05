import mongoose from "mongoose";

const subSectionSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    timeDuration:{
        type:String
    },
    description:{
        type:String,
    },
    videoUrl:{
        type:String,
    }
});
const subSection=mongoose.model("subSection",subSectionSchema);
export default subSection;