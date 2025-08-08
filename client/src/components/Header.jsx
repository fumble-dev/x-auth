import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const { userData } = useContext(AppContext)

  return (
    <header className="flex flex-col items-center mt-20 px-6 text-center text-gray-800 max-w-lg mx-auto select-none">
      <img
        src={assets.header_img}
        alt="Profile"
        className="w-36 h-36 rounded-full mb-6 object-cover shadow-sm ring-1 ring-gray-300"
        loading="lazy"
        draggable={false}
      />

      <h1 className="flex items-center gap-2 text-xl sm:text-3xl mb-3 font-semibold text-gray-900">
        Hey {userData ? userData.name : 'Developer'}!
        <img src={assets.hand_wave} alt="Wave" className="w-8 h-8" />
      </h1>

      <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 leading-tight text-gray-900">
        Welcome to X-Auth
      </h2>

      <p className="mb-10 max-w-md text-sm sm:text-base text-gray-600 leading-relaxed">
        Fast, secure, and developer-first authentication to power your apps. No hassle. Just auth.
      </p>

      <button
        type="button"
        className="border border-gray-500 rounded-full px-10 py-3 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Get Started
      </button>
    </header>
  )
}

export default Header
