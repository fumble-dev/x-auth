import React, { useEffect, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContext } from '../context/AppContext.jsx'

const VerifyEmail = () => {
  const inputRefs = useRef([])
  const navigate = useNavigate()

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext)

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
    axios.defaults.withCredentials = true
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      axios.defaults.withCredentials = true
      const otp = inputRefs.current.map(input => input.value).join('')
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp })
      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) navigate('/')
  }, [isLoggedIn, userData])

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 w-24 cursor-pointer"
      />
      <form onSubmit={onSubmitHandler} className="bg-gray-100 p-6 rounded-md w-80 text-sm shadow">
        <h1 className="text-xl font-semibold text-center mb-3 text-black">Verify Email</h1>
        <p className="text-center text-gray-600 mb-5">Enter the 6-digit code sent to your email.</p>
        <div className="flex justify-between mb-6" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              required
              ref={el => inputRefs.current[index] = el}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-10 text-center text-lg border rounded border-gray-300 focus:outline-none"
            />
          ))}
        </div>
        <button className="w-full py-2 rounded bg-black text-white">Verify Email</button>
      </form>
    </div>
  )
}

export default VerifyEmail
