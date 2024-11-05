import React from 'react'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {setEditCourse, setStep } from '../../../../../slices/courseSlice.js';
import { COURSE_STATUS } from '../../../../../../utils/constant.js';
import { addCourseToCategory, editCourseDetails } from '../../../../../services/operations/courseDetailsAPI.js';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PublishCourse = () => {
    const {register, handleSubmit, setValue, getValues, formState: {errors}} = useForm();
    const {token} = useSelector((state) => state.auth);
    const {course} = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if(course?.status=== COURSE_STATUS.PUBLISHED) {
            setValue("public", true);
        }
    },[]);

    const goBack = () => {
        dispatch(setStep(2));
    }

    const goToMyCourses = () => {
        navigate("/dashboard/my-courses");
    }

    const handlePublish = async () => {
        try {
            setLoading(true);
    
            // Check if no status change is required
            const isPublished = course?.status === COURSE_STATUS.PUBLISHED;
            const isDraft = course?.status === COURSE_STATUS.DRAFT;
            const isPublicChecked = getValues("public");
    
            if ((isPublished && isPublicChecked) || (isDraft && !isPublicChecked)) {
                goToMyCourses();
                dispatch(setStep(1));
                dispatch(setEditCourse(null));
                return;
            }
    
            // Preparing form data for course update
            const formData = new FormData();
            formData.append("courseId", course._id);
            formData.append("status", isPublicChecked ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT);
    
            // Update course status
            const result = await editCourseDetails(formData, token);
            if (!result) {
                throw new Error("Failed to update course details");
            }
    
            // Add course to category
            const categoryId = course?.category;
            if (!categoryId) {
                throw new Error("Course category is missing");
            }

            console.log("categoryid:",categoryId);
            const addCourseCategory = await addCourseToCategory({ categoryId, courseId: course._id }, token);
        
            if (!addCourseCategory) {
                throw new Error("Failed to add course to category");
            }
    
            // If all operations are successful
            goToMyCourses();
            dispatch(setStep(1));
            dispatch(setEditCourse(null));
    
        } catch (error) {
            console.error("Error during course publishing:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false); // Ensure loading is disabled after async operations
        }
    };
    
    
        

    const onSubmit = (data) => {
        setLoading(true);
        handlePublish(data);
    }

  return (
    <div>
        <div className='rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
            <p className='text-2xl font-semibold text-richblack-5' >Publish Settings</p>
            <form onSubmit={handleSubmit(onSubmit)}>

            {/* checkbox */}
            <div className='my-6 mb-8'>
            <label htmlFor="public" className="inline-flex items-center text-lg">
                <input defaultChecked={false} type="checkbox" id="public" name="public" className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5" {...register("public")} />
                <span className="ml-2 text-richblack-400">Make this course as public</span>
            </label>
            </div>

            <div className="ml-auto flex max-w-max items-center gap-x-4">
                <button disabled={loading} onClick={goBack} type="button" className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900">Back</button>
                <button disabled={loading} type='submit' className="flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md py-2 px-5 font-semibold text-richblack-900 undefined">Save Changes</button>
            </div>
            </form>
        </div>
    </div>
  )
}

export default PublishCourse