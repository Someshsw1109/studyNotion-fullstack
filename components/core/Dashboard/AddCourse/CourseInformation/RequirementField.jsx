import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const RequirementField = ({ name, label, register, errors, setValue }) => {
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);
    const { editCourse, course } = useSelector((state) => state.course || { editCourse: false, course: {} });

    useEffect(() => {
        // Register the input field
        register(name, {
            required: true,
        });
    }, [register, name]); // Ensure register and name are included as dependencies

    useEffect(() => {
        if (editCourse) {
            setRequirementList(course?.instructions || []);
            setValue(name, course?.instructions || []);
        }
    }, [editCourse, course]);

    const handleAddRequirement = () => {
        if (requirement) {
            setRequirementList((prev) => [...prev, requirement]);
            setValue(name, [...requirementList, requirement]); // Update the form state
            setRequirement(""); // Clear the input field
        }
    };

    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = requirementList.filter((_, i) => i !== index);
        setRequirementList(updatedRequirementList);
        setValue(name, updatedRequirementList); // Update the form state
    };

    return (
        <div>
            <label className='text-sm text-richblack-5' htmlFor={name}>{label}<sup className='text-pink-200'>*</sup></label>
            <div>
                <input
                    type='text'
                    id={name}
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className='form-style w-full'
                />
                <button
                    type='button'
                    onClick={handleAddRequirement}
                    className='font-semibold text-yellow-50 mt-3'>
                    Add
                </button>
            </div>

            {requirementList.length > 0 && (
                <ul className='mt-2 list-inside list-disc'>
                    {requirementList.map((req, index) => (
                        <li key={index} className='flex items-center text-richblack-5'>
                            <span>{req}</span>
                            <button
                                type='button'
                                onClick={() => handleRemoveRequirement(index)}
                                className='ml-2 text-xs text-pure-greys-300'>
                                clear
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {errors[name] && (
                <span className='ml-2 text-xs tracking-wide text-pink-200'>
                    {label} is required
                </span>
            )}
        </div>
    );
};

export default RequirementField;
