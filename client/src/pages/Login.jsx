import React, { useState } from 'react'
import { assets } from '../assets/assets';

const Login = () => {

  const [state, setState] = useState('Signup');

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-300'>
      <img src={assets.logo} alt="" className='absolute top-5 left-5 sm:left-20 w-28 sn:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {
            state === 'Signup' ? "Create Account" : "Login"
          }
        </h2>
        <p className='text-center text-sm mb-6'>
          {
            state === 'Signup' ? "Create your account" : "Login to your account"
          }
        </p>
        <form action="">
          {state === 'Signup' &&
            (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input className='bg-transparent outline-none text-white' type="text" placeholder='Full Name' required />
            </div>)
          }
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input className='bg-transparent outline-none text-white' type="email" placeholder='Email Id' required />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="" />
            <input className='bg-transparent outline-none text-white' type="password" placeholder='Password' required />
          </div>

          <p className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>

          <button className=' text-white font-md cursor-pointer rounded-full border py-2.5 w-full bg-gradient-to-r from-indigo-400 to-indigo-700'>{state}</button>
        </form>

        {
          state === 'Signup' ?
            (
              <p className='text-gray-400 text-center text-xs mt-4'>
                Already have an account? {" "}
                <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login Here</span>
              </p>
            )
            : (
              <p className='text-gray-400 text-center text-xs mt-4'>
                Don't have an account? {" "}
                <span onClick={() => setState('Signup')} className='text-blue-400 cursor-pointer underline'>Signup</span>
              </p>
            )
        }

      </div>
    </div>
  )
}

export default Login
