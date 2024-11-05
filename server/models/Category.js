import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    // ek tag multiple courses ke liye bhi ho skti haina.
    course:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }],
});
const Category=mongoose.model("Category",categorySchema);
export default Category;