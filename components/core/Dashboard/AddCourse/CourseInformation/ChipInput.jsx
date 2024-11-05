import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ChipInput = ({ name, label, register, errors, setValue }) => {
    const [tags, setTags] = useState([]);
    const { editCourse = false, course = {} } = useSelector((state) => state.course || {});

    useEffect(() => {
        register(name, { required: true });

        if (editCourse && course?.tag) {
            try {
                const parsedTags = JSON.parse(course.tag);
                setTags(parsedTags);
                setValue(name, parsedTags);
            } catch (error) {
                console.error("Failed to parse tags:", error);
            }
        }
    }, [register, name, editCourse, course]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = e.target.value.trim();
            if (value) {
                const updatedTags = [...tags, value];
                setTags(updatedTags);
                setValue(name, updatedTags);
                e.target.value = ""; // Clear input
            }
        }
    };

    return (
        <div>
            <label className='text-sm text-richblack-5' htmlFor={name}>
                {label}<sup className='text-pink-200'>*</sup>
            </label>
            <div className='flex flex-wrap gap-2 m-2'>
                {tags.map((tag, index) => (
                    <div key={index} className='m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-5'>
                        <span>{tag}</span>
                        <button
                            type='button'
                            onClick={() => {
                                const updatedTags = [...tags];
                                updatedTags.splice(index, 1);
                                setTags(updatedTags);
                                setValue(name, updatedTags);
                            }}
                            className='ml-2 text-richblack-5'
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))}
            </div>
            <input
                type='text'
                id={name}
                placeholder='Press Enter or , to add a tag'
                className='form-style w-full'
                onKeyDown={handleKeyDown}
            />
            {errors[name] && <span className='text-xs text-pink-200'>Tags are required</span>}
        </div>
    );
};

export default ChipInput;
