import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext)
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1].focus()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value == '' && index > 0)
      inputRefs.current[index - 1].focus()
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setIsOtpSubmitted(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong")
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute top-4 left-4 w-20 cursor-pointer' />

      {/* enter email form */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-gray-100 p-4 rounded w-72 text-sm'>
          <h1 className='text-xl font-medium text-center mb-2'>Reset Password</h1>
          <p className='text-center text-gray-600 mb-3'>Enter your registered email</p>
          <div className='flex items-center gap-2 px-3 py-2 border rounded bg-white mb-3'>
            <img src={assets.mail_icon} alt="" className='w-4 h-4' />
            <input value={email} onInput={(e) => setEmail(e.target.value)} type="email" placeholder='Email' className='flex-1 bg-transparent outline-none text-black' required />
          </div>
          <button className='w-full py-2 bg-black text-white rounded'>Submit</button>
        </form>
      }

      {/* otp form */}
      {isEmailSent && !isOtpSubmitted &&
        <form onSubmit={onSubmitOtp} className='bg-gray-100 p-4 rounded w-72 text-sm'>
          <h1 className='text-xl font-medium text-center mb-2'>Reset OTP</h1>
          <p className='text-center text-gray-600 mb-3'>Enter the 6-digit code</p>
          <div className='flex justify-between mb-4' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type='text'
                maxLength='1'
                required
                className='w-9 h-10 border text-center text-lg rounded'
                ref={el => inputRefs.current[index] = el}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className='w-full py-2 bg-black text-white rounded'>Submit</button>
        </form>
      }

      {/* new password form */}
      {isEmailSent && isOtpSubmitted &&
        <form onSubmit={onSubmitNewPassword} className='bg-gray-100 p-4 rounded w-72 text-sm'>
          <h1 className='text-xl font-medium text-center mb-2'>New Password</h1>
          <p className='text-center text-gray-600 mb-3'>Enter your new password</p>
          <div className='flex items-center gap-2 px-3 py-2 border rounded bg-white mb-3'>
            <img src={assets.lock_icon} alt="" className='w-4 h-4' />
            <input value={newPassword} onInput={(e) => setNewPassword(e.target.value)} type="password" placeholder='Password' className='flex-1 bg-transparent outline-none text-black' required />
          </div>
          <button className='w-full py-2 bg-black text-white rounded'>Submit</button>
        </form>
      }
    </div>
  )
}

export default ResetPassword
