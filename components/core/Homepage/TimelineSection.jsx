import React from 'react'
import Logo1 from "../../../assets/timelinelogo/Logo1.svg"
import Logo2 from "../../../assets/timelinelogo/Logo2.svg"
import Logo3 from "../../../assets/timelinelogo/Logo3.svg"
import Logo4 from "../../../assets/timelinelogo/Logo4.svg"
import timelinelogo from "../../../assets/images/TimelineImage.png"
const timeline=[
    {
        Logo:Logo1,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo2,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo3,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo4,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    }
]

function TimelineSection() {
  return (
    <div>
        <div className='flex flex-row gap-15 items-center'>

            {/* left section */}
            <div className='w-[45%] flex flex-col gap-5'>
                {
                    timeline.map((element,index)=>{
                        return(
                            <div className='flex flex-row gap-6' key={index}>

                                <div className='w-[50px] h-[50px] bg-white flex items-center'>
                                    <img src={element.Logo}></img>
                                </div>

                                <div>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>



            {/* right-section */}
            <div className='relative shadow-blue-200'>
                <img src={timelinelogo} className='shadow-white object-cover h-fit'></img>
                {/* green-section */}
                <div className='absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-12 left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                    <div className='flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                       <p className='text-3xl font-bold'>10</p>
                       <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                    </div>

                    <div className='flex gap-5 items-center px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-300 text-sm'>Type of Courses</p>
                    </div>
                </div>
            </div>


        </div>
    </div>
  )
}

export default TimelineSection