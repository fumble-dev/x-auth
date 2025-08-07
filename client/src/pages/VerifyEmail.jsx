import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'

const VerifyEmail = () => {

  const inputRefs = useRef([])
  const navigate = useNavigate()

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1].focus()
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value == '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char
      }
    })
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute top-5 left-5 w-24 sm:w-28 cursor-pointer' />
      <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>
          Email Verify OTP
        </h1>
        <p className='text-center mb-6 text-indigo-300'>
          Enter the 6 digit code sent to your email id.
        </p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type='text' maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' ref={e => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
          ))}
        </div>
        <button className='w-full py-3 bg-gradient-to-r from indigo-500 to-indigo-900 text-white rounded-full'>
          Verify Email
        </button>
      </form>
    </div>
  )
}

export default VerifyEmail
