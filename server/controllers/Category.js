import Category from "../models/Category.js"
import Course from "../models/Course.js"


// create Tag ka handler function
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Log the request body to debug
        console.log("Request Body:", req.body);

        const CategorysDetails = await Category.create({
            name: name,
            description: description,
        });
        
        console.log("Category Details:", CategorysDetails);
        return res.status(200).json({
            success: true,
            message: "Categories Created Successfully",
        });
    } catch (error) {
        // Log the error message for debugging
        console.error("Error creating category:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export { createCategory };





// getAllCategory
const showAllCategories=async(req,res)=>{
    try{
        const allCategory=await Category.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            data:allCategory,
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
export {showAllCategories};




// categoryPageDetails
const categoryPageDetails=async(req,res)=>{
	try {
		
		const { categoryId } = req.body;
		console.log("category page detial ke try mai aaaa:");
		// Get courses for the specified category
		console.log("category id:",categoryId);
		const selectedCategory = await Category.findById(categoryId)
    .populate({
        path: "course",
        match: { status: "Published" },
        populate: [{ path: "instructor" }, { path: "ratingAndReviews" }]
    })
    .exec()
    .catch((err) => {
        console.error("Error fetching selected category:", err);
        return null;
    });

if (!selectedCategory) {
    console.log("Category not found or an error occurred.");
    return res.status(404).json({ success: false, message: "Category not found or an error occurred." });
}
console.log("selected category:",selectedCategory);
console.log("course length of this category:",selectedCategory.course.length);
		// Handle the case when there are no courses
		if (selectedCategory.course.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		const selectedCourses = selectedCategory.course;
		console.log("selected course:",selectedCourses);

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		}).populate({path:"course",match:{status:"Published"},populate:([{path:"instructor"},{path:"ratingAndReviews"}])});
		let differentCourses = [];
		for (const category of categoriesExceptSelected) {
			differentCourses.push(...category.course);
		}

		// Get top-selling courses across all categories
		const allCategories = await Category.find().populate({path:"course",match:{status:"Published"},populate:([{path:"instructor"},{path:"ratingAndReviews"}])});
		console.log("allcategories:",allCategories);
		const allCourses = allCategories.flatMap((category) => category.course);
		console.log("all courses of a category:",allCourses);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);

		res.status(200).json({
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses: mostSellingCourses,
			success: true,
		});
		console.log("most selling:",mostSellingCourses);
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}
export {categoryPageDetails}







const addCourseToCategory = async (req, res) => {
	const { courseId, categoryId } = req.body;
	console.log("category id", categoryId);
	try {

		const category = await Category.findById(categoryId);
		console.log("category:",category);
		if (!category) {
			return res.status(404).json({
				success: false,
				message: "Category not found",
			});
		}
		const course = await Course.findById(courseId);
		console.log("course:",course);
		if (!course) {
			return res.status(404).json({
				success: false,
				message: "Course not found",
			});
		}
		if(category.course.includes(courseId)){
			return res.status(200).json({
				success: true,
				message: "Course already exists in the category",
			});
		}
		category.course.push(courseId);
		await category.save();
		return res.status(200).json({
			success: true,
			message: "Course added to category successfully",
		});
	}
	catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}
export {addCourseToCategory}