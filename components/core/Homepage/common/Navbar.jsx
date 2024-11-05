import React, { useEffect, useState } from 'react'
import { Link,matchPath } from 'react-router-dom'
import logo from "../../../../assets/logo/Logo-Full-Light (1).png"
import {NavbarLinks} from "../../../../data/navbar-links.js"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaShoppingCart } from "react-icons/fa";
import ProfileDropDown from "../../Auth/ProfileDropDown.jsx"
import { apiConnector } from '../../../../services/apniconnect.js'
import {categories} from '../../../../services/apis.js'
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useDispatch } from 'react-redux'
import { setProgress } from '../../../../slices/loadingBarSlice.js'
import { useRef } from 'react'
import { HiSearch } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
    const {token}=useSelector((state)=>state.auth);
    const {user}=useSelector((state)=>state.profile);
    const {totalItems}=useSelector((state)=>state.cart);
    const [searchValue, setSearchValue] = useState("")

    const location=useLocation();
    const matchRoutes = (routes) => {
      return matchPath({ path: routes }, location.pathname)
  }

   const [sublinks, setsublinks] = useState([]);
   const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      if (result?.data?.data?.length > 0) {
        setsublinks(result?.data?.data);
      }
      localStorage.setItem("sublinks", JSON.stringify(result.data.data));
    } catch (error) {
      console.error("Error fetching sublinks:", error); 
    }
  }
  
    useEffect(() => {
        fetchSublinks();
    }, [])

    const handleSearch = (e) => {
      e.preventDefault();
      if (searchValue?.length > 0) {
          navigate(`/search/${searchValue}`);
          setSearchValue("");
      }
  }

    const show = useRef();
    const overlay = useRef();

    const shownav = () => {
        show.current.classList.toggle('navshow');
        overlay.current.classList.toggle('hidden');
    }



  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

         {/*study-notion logo */}
        <Link to="/">
        <img src={logo} width={160} height={42} loading='lazy'></img>
        </Link>




        {/* NavLinks */}
        <nav>
  <ul className="flex gap-x-6 text-richblack-25">
    {NavbarLinks.map((link, index) => (
      <li key={index}>
        {link.title === "Catalog" ? (

<div className=' flex items-center group relative cursor-pointer'>
<p>{link.title}</p>
<svg width="25px" height="20px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000" strokeWidth="0.00024000000000000003"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.384"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="#ffffff"></path> </g></svg>

<div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]'>
    <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'></div>
    {
        sublinks?.length < 0 ? (<div></div>) : (
            sublinks?.map((link, index) => (
                <Link to={`/catalog/${link?.name}`} key={index} className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50" onClick={() => { dispatch(setProgress(30)) }}>
                    <p className=''>
                        {link?.name}
                    </p>
                </Link>
            ))
        )

    }
</div>
</div>
        ) : (
          <Link to={link?.path}>
            <p
              className={`${
                matchRoutes(link?.path)
                  ? "text-yellow-25"
                  : "text-richblack-25"
              }`}
            >
              {link.title}
            </p>
          </Link>
        )}
      </li>
    ))}
    <form onSubmit={handleSearch} className='flex items-center relative'>
                            <input value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} id='searchinput' type="text" placeholder="Search" className=' absolute top-0 left-0 border-0 focus:ring-1 ring-richblack-400 rounded-full px-2 py-1 text-[15px] w-28 text-richblack-50 focus:outline-none focus:border-transparent bg-richblack-700' />
                            <HiSearch type='submit' id='searchicon' size={20} className=" text-richblack-100 top-1 absolute cursor-pointer left-20" />
                        </form>
  </ul>
        </nav>







        {/* login,signup,dashboard */}
        {/* There are 4 cases:if user is not signup/login(does not have token),if user have token(ProfileDropDown), if user is there but it is not instructor then cart icon */}
        
        <div className='flex gap-x-4 items-center'>
            {
                user && user?.accountType!="Instructor" &&(
                  <Link to="/dashboard/cart" className='relative'>
                  <div className='bg-black rounded-full p-2'>
                      <FaShoppingCart className='text-white' />
                  </div>
                  {totalItems > 0 && <span>{totalItems}</span>}
              </Link>              
                )
            }


            {
                token==null && (
                    <Link to="/login">
                        <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-white'>
                            Log in
                        </button>
                    </Link>
                )
            }

            {
                token==null && (
                    <Link to="/signup">
                        <button className='border border-richblack-700 bg-richblue-800 text-white px-[12px] py-[8px]'>
                        Sign Up</button>  
                    </Link>
                )
            }

            {
                token!=null && <ProfileDropDown></ProfileDropDown>
            }
        </div>



        </div>
    </div>
  )
}

export default Navbar