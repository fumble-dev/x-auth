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
      const { data } = await axios.post(backendUrl + '/api/auth/logout')

      if (data.success) {
        setIsLoggedIn(false)
        setUserData(false)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      navigate('/email-verify')
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      data.success ? toast.success(data.message) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="fixed top-0 w-full flex justify-between items-center px-4 py-3 bg-white border-b z-50 sm:px-12">
      <img src={assets.logo} alt="logo" className="w-24 sm:w-28" />

      {userData ? (
        <div className="relative group cursor-pointer">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-white text-sm font-medium">
            {userData.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="absolute right-0 mt-2 hidden flex-col rounded border bg-white shadow group-hover:flex text-sm">
            <ul className="py-1">
              {!userData.isAccountVerified && (
                <li onClick={sendVerificationOtp} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Verify Email
                </li>
              )}
              <li onClick={logout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 rounded border px-4 py-1.5 text-gray-700 text-sm hover:bg-gray-100"
        >
          Login <img src={assets.arrow_icon} alt="arrow" className="w-4" />
        </button>
      )}
    </div>
  )
}

export default Navbar
