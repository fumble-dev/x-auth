import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContext)

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`)

      if (data.success) {
        setIsLoggedIn(false)
        setUserData(null)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message || "Logout failed")
    }
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      navigate('/email-verify')
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`)

      if (data.success) toast.success(data.message)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message || "Failed to send verification OTP")
    }
  }

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-4 py-3 bg-white border-b z-50 sm:px-12">
      <img
        src={assets.logo}
        alt="Logo"
        className="w-24 sm:w-28 cursor-pointer"
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      />

      {userData ? (
        <div className="relative group cursor-pointer" tabIndex={0} aria-label="User menu">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm font-medium select-none"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {userData.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="absolute right-0 mt-2 hidden flex-col rounded border bg-white shadow group-hover:flex text-sm">
            <ul className="py-1">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  role="menuitem"
                  tabIndex={-1}
                >
                  Verify Email
                </li>
              )}
              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                role="menuitem"
                tabIndex={-1}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 rounded border px-4 py-1.5 text-gray-700 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Login"
        >
          Login
          <img src={assets.arrow_icon} alt="" className="w-4" aria-hidden="true" />
        </button>
      )}
    </nav>
  )
}

export default Navbar
