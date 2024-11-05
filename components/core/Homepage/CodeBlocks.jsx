import React from 'react'
import CTAButton from "../Homepage/Button.jsx"
//import HighlightText from "../Homepage/HighlightText.jsx"
import { FaArrowRight } from 'react-icons/fa6'
import { TypeAnimation } from 'react-type-animation';


function CodeBlocks({
    position,heading,subheading,ctabtn1,ctabtn2,codeblock,backgroundgradient,codecolor
}) {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>

        {/* section-1 */}
        <div className='w-[50%] flex flex-col gap-8'>
            {heading}
            <div className='text-richblack-300 font-bold'>
                {subheading}
            </div>

            <div className='flex gap-7 mt-7'>
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight></FaArrowRight>
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    <div className='flex gap-2 items-center'>
                        {ctabtn2.btnText}
                    </div>
                </CTAButton>
            </div>
        </div>

        {/* section-2 */}
        <div className='flex flex-row h-fit text-10px w-[100%] py-4 lg:w-[500px]'>
            <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                <p>1</p>
                <p>2</p>
                <p>3</p>
                <p>4</p>
                <p>5</p>
                <p>6</p>
                <p>7</p>
                <p>8</p>
                <p>9</p>
                <p>10</p>
                <p>11</p>
            </div>


            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codecolor} pr-2`}>
                <TypeAnimation
                sequence={[codeblock,5000,""]}
                repeat={Infinity}
                cursor={true}

                style={
                    {
                        whiteSpace:"pre-line",
                        display:"block",
                    }
                }
                omitDeletionAnimation={true}
                ></TypeAnimation>
            </div>
        </div>

    </div>
  )
}

export default CodeBlocks


