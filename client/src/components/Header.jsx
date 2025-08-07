import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const { userData } = useContext(AppContext)

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img src={assets.header_img} alt="Profile" className="w-36 h-36 rounded-full mb-6" />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl mb-2">
        Hey {userData ? userData.name : "Developer"}!
        <img src={assets.hand_wave} alt="Wave" className="w-8 h-8" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to X-Auth
      </h2>

      <p className="mb-8 max-w-md text-sm sm:text-base text-gray-600">
        Fast, secure, and developer-first authentication to power your apps. No hassle. Just auth.
      </p>

      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition">
        Get Started
      </button>
    </div>
  )
}

export default Header
