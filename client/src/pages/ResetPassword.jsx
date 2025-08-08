import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const [loading, setLoading] = useState(false) // New loading state

  const inputRefs = useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1].focus()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0)
      inputRefs.current[index - 1].focus()
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Something went wrong')
    }
    setLoading(false)
  }

  const onSubmitOtp = (e) => {
    e.preventDefault()
    const otpArray = inputRefs.current.map((e) => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50 via-white to-purple-50 px-4">
      <img
        src={assets.logo}
        alt="Logo"
        className="absolute top-5 left-5 w-20 cursor-pointer select-none"
        onClick={() => navigate('/')}
      />

      {/* Email form */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">Reset Password</h2>
          <p className="text-center text-gray-600 mb-4">Enter your registered email address</p>
          <div className="flex items-center gap-4 border border-indigo-300 rounded-xl px-4 py-3 bg-indigo-50 focus-within:ring-2 focus-within:ring-indigo-400">
            <img src={assets.mail_icon} alt="Email icon" className="w-6 h-6" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-900 placeholder-indigo-400"
              required
              disabled={loading}
            />
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
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {/* OTP form */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOtp}
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">Enter OTP</h2>
          <p className="text-center text-gray-600 mb-4">Type the 6-digit code sent to your email</p>
          <div
            className="flex justify-between space-x-3 mb-6"
            onPaste={handlePaste}
            aria-label="OTP input"
          >
            {Array(6)
              .fill(0)
              .map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  required
                  className="w-12 h-14 border-2 border-indigo-300 rounded-xl text-center text-xl font-mono focus:border-indigo-600 focus:ring-2 focus:ring-indigo-400 transition"
                  ref={(el) => (inputRefs.current[idx] = el)}
                  onInput={(e) => handleInput(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  disabled={loading}
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
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {/* New password form */}
      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">New Password</h2>
          <p className="text-center text-gray-600 mb-4">Enter your new password</p>
          <div className="flex items-center gap-4 border border-indigo-300 rounded-xl px-4 py-3 bg-indigo-50 focus-within:ring-2 focus-within:ring-indigo-400">
            <img src={assets.lock_icon} alt="Lock icon" className="w-6 h-6" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-transparent outline-none w-full text-gray-900 placeholder-indigo-400"
              required
              disabled={loading}
            />
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPassword
