import Course from "../models/Course.js"
import Category from "../models/Category.js"
import User from "../models/User.js"
import uploadImageToCloudinary from "../utils/imageUploader.js"
import dotenv from "dotenv"
dotenv.config();
import Section from "../models/Section.js"
import SubSection from "../models/SubSection.js"
import convertSecondsToDuration from "../utils/secToDuration.js";
import CourseProgress from "../models/CourseProgress.js"


// 1. createcourse
const createCourse = async (req, res) => {
	
    try {
        const userId = req.user.id;
		console.log("userID:",userId);

        // Destructure request body
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            category,
            status,
            instructions,
        } = req.body;
		console.log(courseName,courseDescription,whatYouWillLearn,price,tag,category,status);

		// fetch file from request
		const thumbnail = req.files.thumbnailImage;
		console.log("file aaagyi",thumbnail);

        // Validation
        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag ||
            !thumbnail ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message: "All Fields are Mandatory",
            });
        }



        // Check for instructor status
        if (!status || status === undefined) {
            status = "Draft";
        }

        // Check if the user is an instructor
        const instructorDetails = await User.findOne({
            _id: userId,
            accountType: "Instructor",
        });

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
		}

        // Check if category is valid
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category details not found",
            });
        }


        // Upload the image to cloudinary
        const response = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
		console.log(response);

        // Create an entry for the new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnail.secure_url,
            status: status,
            instructions: instructions,
        });

        // Add the new course to the instructor's user schema
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        // Update the category schema
        await Category.findByIdAndUpdate(
            { _id: category },
            { $push: { courses: newCourse._id } }, // Ensure it's courses if the field name is correct
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        });
    }
};
export { createCourse };









// 2. getAllcourses handler function
const getAllCourses=async(req,res)=>{
    try {
		const allCourses = await Course.find(
			{},
			{
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnroled: true,
			}
		)
			.populate("instructor")
			.exec();
		return res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		console.log(error);
		return res.status(404).json({
			success: false,
			message: `Can't Fetch Course Data`,
			error: error.message,
		});
	}
}
export {getAllCourses};








// 3. show entire data of a course(getcourseDetails)
    const getCourseDetails=async(req,res)=>{
        try {
			
            const {courseId}=req.body;
			
			const courseDetails=await Course.find({_id: courseId}).populate({path:"instructor",
				populate:{path:"additionalDetails"}})
				.populate("category")
				.populate({                    //only populate user name and image
					path:"ratingAndReviews"
				})
				.populate({path:"courseContent",populate:{path:"subSection"}})
				.exec();
			
				if(!courseDetails){
					return res.status(404).json({
						success:false,
						message:"Course Not Found"
					})
				}
				return res.status(200).json({
					success:true,
					message:"Course fetched successfully now",
					data:courseDetails
				});
					
				}  catch (error) {
            console.log(error);
            return res.status(404).json({
                success:false,
                message:`Can't Fetch Course Data`,
                error:error.message
            })   
        }
    }
export {getCourseDetails};








// Function to get all courses of a particular instructor
const getInstructorCourses = async (req, res) => {
	try {
		// Get user ID from request object
		const userId = req.user.id;

		// Find all courses of the instructor
		const allCourses = await Course.find({ instructor: userId });

		// Return all courses of the instructor
		res.status(200).json({
			success: true,
			data: allCourses,
		});
	} catch (error) {
		// Handle any errors that occur during the fetching of the courses
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch courses",
			error: error.message,
		});
	}
}
export {getInstructorCourses};







// PENDING:SEARCHCOURSEMARKLECTUREASCOMPLETE
//Edit Course Details
const editCourse = async (req, res) => {
	try {
		const { courseId } = req.body
		const updates = req.body
		const course = await Course.findById(courseId)
	
		if (!course) {
		  return res.status(404).json({ error: "Course not found" })
		}
	
		// If Thumbnail Image is found, update it
		if (req.files) {
		  console.log("thumbnail update")
		  const thumbnail = req.files.thumbnailImage
		  const thumbnailImage = await uploadImageToCloudinary(
			thumbnail,
			process.env.FOLDER_NAME
		  )
		  course.thumbnail = thumbnailImage.secure_url
		}
	
		// Update only the fields that are present in the request body
		for (const key in updates) {
		  if (updates.hasOwnProperty(key)) {
			if (key === "tag" || key === "instructions") {
			  course[key] = JSON.parse(updates[key])
			} else {
			  course[key] = updates[key]
			}
		  }
		}
	
		await course.save()
	
		const updatedCourse = await Course.findOne({
		  _id: courseId,
		})
		  .populate({
			path: "instructor",
			populate: {
			  path: "additionalDetails",
			},
		  })
		  .populate("category")
		  .populate("ratingAndReviews")
		  .populate({
			path: "courseContent",
			populate: {
			  path: "subSection",
			},
		  })
		  .exec()
	
		res.json({
		  success: true,
		  message: "Course updated successfully",
		  data: updatedCourse,
		})
	  } catch (error) {
		console.error(error)
		res.status(500).json({
		  success: false,
		  message: "Internal server error",
		  error: error.message,
		})
	  }
}




  //get full course details
  // Get full course details
const getFullCourseDetails = async (req, res) => {
	try {
		console.log("Entered getFullCourseDetails function");
		
		const { courseId } = req.body;
		const userId = req.user.id;

		// Check if courseId and userId are valid
		if (!courseId || !userId) {
			return res.status(400).json({
				success: false,
				message: "Invalid courseId or userId",
			});
		}

		// Fetch course details
		const courseDetails = await Course.findOne({ _id: courseId })
			.populate({
				path: "instructor",
				populate: { path: "additionalDetails" },
			})
			.populate("category")
			.populate("ratingAndReviews")
			.populate({
				path: "courseContent",
				populate: { path: "subSection" },
			})
			.exec();

		if (!courseDetails) {
			return res.status(404).json({
				success: false,
				message: `Could not find course with id: ${courseId}`,
			});
		}

		// Fetch course progress for the user
		const courseProgressCount = await CourseProgress.findOne({
			courseID: courseId,
			userID: userId,
		});

		// Calculate total course duration in seconds
		let totalDurationInSeconds = 0;
		courseDetails.courseContent.forEach((content) => {
			content.subSection.forEach((subSection) => {
				const timeDurationInSeconds = parseInt(subSection.timeDuration);
				totalDurationInSeconds += timeDurationInSeconds;
			});
		});

		// Convert seconds to a human-readable format
		const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

		// Send response
		return res.status(200).json({
			success: true,
			data: {
				courseDetails,
				totalDuration,
				completedVideos: courseProgressCount?.completedVideos || ["none"],
			},
		});
	} catch (error) {
		console.error("Error in getFullCourseDetails:", error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};



//Delete Course
const deleteCourse = async (req, res) => {
	try {
	  const { courseId } = req.body
	  // Find the course
	  const course = await Course.findById(courseId)
	  if (!course) {
		return res.status(404).json({ message: "Course not found" })
	  }
  
	  // Unenroll students from the course
	  const studentsEnrolled = course.studentsEnrolled
	  for (const studentId of studentsEnrolled) {
		await User.findByIdAndUpdate(studentId, {
		  $pull: { courses: courseId },
		})
	  }
  
	  // Delete sections and sub-sections
	  const courseSections = course.courseContent
	  for (const sectionId of courseSections) {
		// Delete sub-sections of the section
		const section = await Section.findById(sectionId)
		if (section) {
		  const subSections = section.subSection
		  for (const subSectionId of subSections) {
			await SubSection.findByIdAndDelete(subSectionId);
		  }
		}
  
		// Delete the section
		await Section.findByIdAndDelete(sectionId)
	  }
  
	  // Delete the course
	  await Course.findByIdAndDelete(courseId)

	  //Delete course id from Category
	  await Category.findByIdAndUpdate(course.category._id, {
		$pull: { courses: courseId },
	     })
	
	//Delete course id from Instructor
	await User.findByIdAndUpdate(course.instructor._id, {
		$pull: { courses: courseId },
		 })
  
	  return res.status(200).json({
		success: true,
		message: "Course deleted successfully",
	  })
	} catch (error) {
	  console.error(error)
	  return res.status(500).json({
		success: false,
		message: "Server error",
		error: error.message,
	  })
	}
  }



  //search course by title,description and tags array
  const searchCourse = async (req, res) => {
	try {
	  const  { searchQuery }  = req.body
	//   console.log("searchQuery : ", searchQuery)
	  const courses = await Course.find({
		$or: [
		  { courseName: { $regex: searchQuery, $options: "i" } },
		  { courseDescription: { $regex: searchQuery, $options: "i" } },
		  { tag: { $regex: searchQuery, $options: "i" } },
		],
  })
  .populate({
	path: "instructor",  })
  .populate("category")
  .populate("ratingAndReviews")
  .exec();

  return res.status(200).json({
	success: true,
	data: courses,
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}		
}					

//mark lecture as completed
const markLectureAsComplete = async (req, res) => {
	const { courseId, subSectionId, userId } = req.body
	if (!courseId || !subSectionId || !userId) {
	  return res.status(400).json({
		success: false,
		message: "Missing required fields",
	  })
	}
	try {
	progressAlreadyExists = await CourseProgress.findOne({
				  userID: userId,
				  courseID: courseId,
				})
	  const completedVideos = progressAlreadyExists.completedVideos
	  if (!completedVideos.includes(subSectionId)) {
		await CourseProgress.findOneAndUpdate(
		  {
			userID: userId,
			courseID: courseId,
		  },
		  {
			$push: { completedVideos: subSectionId },
		  }
		)
	  }else{
		return res.status(400).json({
			success: false,
			message: "Lecture already marked as complete",
		  })
	  }
	  await CourseProgress.findOneAndUpdate(
		{
		  userId: userId,
		  courseID: courseId,
		},
		{
		  completedVideos: completedVideos,
		}
	  )
	return res.status(200).json({
	  success: true,
	  message: "Lecture marked as complete",
	})
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
}


export {editCourse,deleteCourse,markLectureAsComplete,getFullCourseDetails,searchCourse}