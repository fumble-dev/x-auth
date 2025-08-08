import React, { useEffect, useRef, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext.jsx'

const VerifyEmail = () => {
  const inputRefs = useRef([])
  const navigate = useNavigate()

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      axios.defaults.withCredentials = true
      const otp = inputRefs.current.map(input => input.value).join('')
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp })
      if (data.success) {
        toast.success(data.message)
        await getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) navigate('/')
  }, [isLoggedIn, userData, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50 via-white to-purple-50 px-4">
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 w-20 cursor-pointer select-none"
      />
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-700">Verify Email</h1>
        <p className="text-center text-gray-600">
          Enter the 6-digit code sent to your email.
        </p>
        <div
          className="flex justify-between space-x-3"
          onPaste={handlePaste}
          aria-label="OTP input"
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                disabled={loading}
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 border-2 border-indigo-300 rounded-xl text-center text-xl font-mono focus:border-indigo-600 focus:ring-2 focus:ring-indigo-400 transition disabled:bg-indigo-100"
              />
            ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            loading
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  )
}

export default VerifyEmail
