import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'

const Navbar = () => {

  const navigate = useNavigate()

  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)

  return (
    <div className='w-full flex justify-between items-center px-4 py-3 sm:px-12 fixed top-0 bg-white shadow-sm z-50'>
      <img src={assets.logo} alt="" className='w-24 sm:w-28' />

      {
        userData ?
          (
            <div className='relative group cursor-pointer'>
              <div className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm font-medium'>
                {userData.name[0].toUpperCase()}
              </div>
              <div className='absolute hidden group-hover:block right-0 mt-2 bg-white border rounded shadow text-sm'>
                <ul className='py-1'>
                  <li className='px-4 py-2 hover:bg-gray-100'>Verify Email</li>
                  <li className='px-4 py-2 hover:bg-gray-100'>Logout</li>
                </ul>
              </div>
            </div>
          ) :
          (
            <button onClick={() => navigate('/login')} className='flex items-center gap-2 text-sm border rounded px-4 py-1.5 text-gray-700 hover:bg-gray-100'>
              Login <img src={assets.arrow_icon} alt="" className='w-4' />
            </button>
          )
      }

    </div>
  )
}

export default Navbar
