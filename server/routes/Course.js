// Import the required modules
import express from "express"
const router = express.Router();

// Import the Controllers

// Course Controllers Import
import  {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getInstructorCourses,
  editCourse,
  getFullCourseDetails,
  deleteCourse,
  searchCourse,
  markLectureAsComplete,
} from "../controllers/Course.js"


// Categories Controllers Import
import  {
  showAllCategories,
  createCategory,
  categoryPageDetails,
  addCourseToCategory,
} from "../controllers/Category.js"

// Sections Controllers Import
import  {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/Section.js"

// Sub-Sections Controllers Import
import  {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/Subsection.js"

// Rating Controllers Import
import {
  createRating,
  getAverageRating,
  getAllRating,
} from "../controllers/RatingAndReview.js"


// Importing Middlewares
import  { auth, isInstructor, isStudent, isAdmin } from "../middlewares/auth.js"


// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, (req, res) => {
  console.log("Instructor successfully authorized"); // Debugging line
  createCourse(req, res);
});


router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Edit a Course
router.post("/editCourse", auth, isInstructor, editCourse)
// Get all Courses of a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
//Get full course details
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Delete a Course
router.delete("/deleteCourse",auth, deleteCourse)
// Search Courses
router.post("/searchCourse", searchCourse);
//mark lecture as complete
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);




router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/addCourseToCategory", auth, isInstructor, addCourseToCategory);


router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

export default router