// profile create krliya pehele se,update krna hai sirf

import Profile from "../models/Profile.js"
import User from "../models/User.js"
import uploadImageToCloudinary from "../utils/imageUploader.js"

const updateProfile = async (req, res) => {
    try {
        // Get userId
        const id = req.user?.id; 
        if (!id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Get data
        const { dob, about, contactNumber, gender } = req.body;
        
        // Validation
        if (!contactNumber || !dob || !about) {
            return res.status(400).json({
                success: false,
                message: "Contact number, date of birth, and about are required.",
            });
        }

        // Find profile
        const userDetails = await User.findById(id);
        console.log("id;",id);
       
        
        const profileDetails = await Profile.findById(userDetails.additionalDetails);
        if (!profileDetails) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // Update profile
        profileDetails.dob = dob;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        if (gender) {
            profileDetails.gender = gender; // Only update if gender is provided
        }

        await profileDetails.save();

        // Return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });
    } catch (error) {
        console.error("Error updating profile:", error); // Log the error
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export { updateProfile };



// DELETE ACCOUNT(explore how can we schedule delete account(chronejob))
const deleteAccount=async(req,res)=>{
    try{
        // get id-kyuki wo login hai to id nikal skte hai uski.
        const id=req.user.id;
        // validation
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"user not found",
            })
        }
        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        // delete user
        await User.findByIdAndDelete({_id:id});

        // return response
        return res.status(200).json({
            success:true,
            message:"account deleted successfully",
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"user cannot be deleted,error",
        })
    }
}
export {deleteAccount}



const getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // Check if user exists
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const getEnrolledCourses=async (req,res) => {
	try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const enrolledCourses = await User.findById(id).populate({
			path : "courses",
				populate : {
					path: "courseContent",
			}
		}
		).populate("courseProgress").exec();
        // console.log(enrolledCourses);
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: enrolledCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//updateDisplayPicture
const updateDisplayPicture = async (req, res) => {
	try {

	const id = req.user.id;
	const user = await User.findById(id);
	if (!user) {
		return res.status(404).json({
            success: false,
            message: "User not found",
        });
	}
    //console.log("image:")
	const image = req.files.pfp;
	if (!image) {
		return res.status(404).json({
            success: false,
            message: "Image not found",
        });
    }
	const uploadDetails = await uploadImageToCloudinary(
		image,
		process.env.FOLDER_NAME
	);
	console.log(uploadDetails);

	const updatedImage = await User.findByIdAndUpdate({_id:id},{image:uploadDetails.secure_url},{ new: true });

    res.status(200).json({
        success: true,
        message: "Image updated successfully",
        data: updatedImage,
    });
		
	} catch (error) {
		return res.status(500).json({
            success: false,
            message: error.message,
        });
		
    }
}

//instructor dashboard
const instructorDashboard = async (req, res) => {
	try {
		const id = req.user.id;
		const courseData = await Course.find({instructor:id});
		const courseDetails = courseData.map((course) => {
			totalStudents = course?.studentsEnrolled?.length;
			totalRevenue = course?.price * totalStudents;
			const courseStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudents,
				totalRevenue,
			};
			return courseStats;
		});
		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: courseDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
}
export {instructorDashboard,updateDisplayPicture,getAllUserDetails,getEnrolledCourses}