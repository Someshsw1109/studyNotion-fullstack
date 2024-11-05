import React, { act } from 'react'
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/Homepage/HighlightText.jsx';
import CTAButton from '../components/core/Homepage/Button';
import Banner from "../assets/images/banner.mp4"
import CodeBlocks from '../components/core/Homepage/CodeBlocks';
import { FaArrowRight } from 'react-icons/fa6';
import TimelineSection from '../components/core/Homepage/TimelineSection.jsx';
import LearningLanguageSection from '../components/core/Homepage/LearningLanguageSection.jsx';
import InstructorSection from "../components/core/Homepage/InstructorSection.jsx"
import Footer from "../components/core/Homepage/common/Footer.jsx"
import ExploreMore from "../components/core/Homepage/ExploreMore.jsx"


function Home() {
  return (
    <div>
    {/* Section-1 */}
    <div className='relative mx-auto flex flex-col w-11/12 items-center text-white justify-between max-w-maxContent'>

      <Link to={"/signup"}>
      <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
        <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900'>
          <p>Become an Instructor</p>
          <FaArrowRightLong/>
        </div>
      </div>
      </Link>

      <div className='text-center text-4xl font-semibold mt-8'>
        Empower Your Future with
        <HighlightText text={" Coding Skills"}></HighlightText>
      </div>


      <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300 '>
        With our online coding courses,you can learn at your own pace,form anywhere in the world,and get access to a wealth of resources,including hands-on projects,quizzes,and personalized feedback from instructors. 
      </div>


      <div className='flex flex-row gap-7 mt-8'>
        <CTAButton active={true} linkto={"/signup"}>
          Learn More
        </CTAButton>

        <CTAButton active={false} linkto={"/login"}>
          Book a Demo
        </CTAButton>
      </div>



      <div className='relative mx-3 my-12 w-[70%]'>
  <div className='grad2 -top-10 w-[800px]'></div>
  <div className="shadow-[0_15px_50px_rgba(59,130,246,0.6)]">
    <video muted loop autoPlay>
      <source src={Banner} type='video/mp4'></source>
    </video>
  </div>
</div>




    {/* code-section-1 */}
      <div>
        <CodeBlocks
        position={"lg:flex-row"}
        heading={
          <div className='text-4xl font-semibold'>
            Unlock Your
            <HighlightText text={" coding potential "}></HighlightText>
            with our online courses
          </div>
        }

        subheading={
          "Our courses are designed and taught by industry experts who have years of experience in coding and passionate about sharing their knowledge with you. "
        }

        ctabtn1={
          {
            btnText:"try it yourself",
            linkto:"/signup",
            active:true,
          }
        }

        ctabtn2={
          {
            btnText:"learn more",
            linkto:"/login",
            active:false,
          }
        }

        codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}       
        codecolor={"text-yellow-25"}   
         ></CodeBlocks>
      </div>



      {/* code-section-2 */}
      <div>
        <CodeBlocks
        position={"lg:flex-row-reverse"}
        heading={
          <div className='text-4xl font-semibold'>
            Start
            <HighlightText text={" coding in seconds "}></HighlightText>
          </div>
        }

        subheading={
          "Our courses are designed and taught by industry experts who have years of experience in coding and passionate about sharing their knowledge with you. "
        }

        ctabtn1={
          {
            btnText:"try it yourself",
            linkto:"/signup",
            active:true,
          }
        }

        ctabtn2={
          {
            btnText:"learn more",
            linkto:"/login",
            active:false,
          }
        }

        codeblock={`import React from "react";\n import CTAButton from "./Button";\n import TypeAnimation from "react-type"\n import {FaArrowRight} from  "react-icons/fa"; \n \n const Home=()=>{\n return (\n <div>Home</div>\n)\n}\n export default Home;\n `}        
        codecolor={"text-blue-25"}
        backgroundgradient={{
          backgroundImage: "linear-gradient(to right, #34d399, #3b82f6)",
          padding: "1rem",
          borderRadius: "0.5rem",
        }}
        ></CodeBlocks>
      </div>

      <ExploreMore></ExploreMore>
    </div>








    {/* Section-2 */}
<div className='bg-pure-greys-5 text-richblack-700'>
<div className='homepage_bg h-[310px]'>

<div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
    <div className='h-[150px]'></div>
    <div className='flex flex-row gap-7 text-white '>
        <CTAButton active={true} linkto={"/catalog/Web Developement"}>
            <div className='flex items-center gap-3'>
                Explore Full Catalog
                <FaArrowRight />
            </div>
        </CTAButton>
        <CTAButton active={false} linkto={"/signup"}>
            <div>
                Learn more
            </div>
        </CTAButton>
    </div>
</div>
</div>



      <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>
      
      <div className='flex flex-row gap-5'>
        <div className='text-4xl font-semibold w-[45%]'>
          Give the Skills you need for a
          <HighlightText text={" Job that is in demand"}></HighlightText>
        </div>

        <div className='flex flex-col gap-10 w-[40%] items-start'>
                    <div className='text-[16px]'>
                    The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                    </div>
                    <CTAButton active={true} linkto={"/signup"}>
                        <div>
                            Learn more
                        </div>
                    </CTAButton>
                    </div>
                    </div>

                    <TimelineSection></TimelineSection>
                    <LearningLanguageSection></LearningLanguageSection>
          </div>
    </div>







    {/* Section-3 */}
    <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter: bg-richblack-900 text-white mt-'>
    <InstructorSection></InstructorSection>
    </div>    

    <div className=' mb-16 mt-3'>
        <h2 className='text-center text-2xl md:text-4xl font-semibold mt-8 text-richblack-5 mb-5'>Reviews from other learners</h2>
        {/* <RatingSlider /> */}
      </div>
    












    {/* Footer */}
    <Footer></Footer>
    </div>
  )
}

export default Home


// 1.Agar group ki property lagani hia to parent ko group banao aur child pe property lagao:yaha necessary nhi tha.