import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [state, setState] = useState('Signup');
  const navigate = useNavigate()

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true

      if (state === 'Signup') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })
        if (data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/');
        } else {

          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })
        if (data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); 
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }

  }

  return (
    <div className='flex items-center justify-center min-h-screen px-4 bg-white'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute top-5 left-5 w-24 sm:w-28 cursor-pointer' />
      <div className='bg-gray-100 p-6 rounded-md shadow-md w-full sm:w-96 text-gray-800 text-sm'>
        <h2 className='text-2xl font-semibold text-center mb-2'>
          {
            state === 'Signup' ? "Create Account" : "Login"
          }
        </h2>
        <p className='text-center text-sm mb-5 text-gray-500'>
          {
            state === 'Signup' ? "Create your account" : "Login to your account"
          }
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === 'Signup' &&
            (<div className='mb-4 flex items-center gap-3 w-full px-4 py-2 rounded-md bg-white border'>
              <img src={assets.person_icon} alt="" className='w-5' />
              <input value={name} onChange={e => setName(e.target.value)} className='bg-transparent outline-none w-full' type="text" placeholder='Full Name' required />
            </div>)
          }
          <div className='mb-4 flex items-center gap-3 w-full px-4 py-2 rounded-md bg-white border'>
            <img src={assets.mail_icon} alt="" className='w-5' />
            <input value={email} onChange={e => setEmail(e.target.value)} className='bg-transparent outline-none w-full' type="email" placeholder='Email Id' required />
          </div>
          <div className='mb-4 flex items-center gap-3 w-full px-4 py-2 rounded-md bg-white border'>
            <img src={assets.lock_icon} alt="" className='w-5' />
            <input value={password} onChange={e => setPassword(e.target.value)} className='bg-transparent outline-none w-full' type="password" placeholder='Password' required />
          </div>

          <p onClick={() => navigate('/reset-password')} className='mb-4 text-sm text-blue-600 cursor-pointer text-right'>
            Forgot Password?
          </p>

          <button className='text-white font-medium rounded-md py-2 w-full bg-blue-600 hover:bg-blue-700 transition'>
            {state}
          </button>
        </form>

        {
          state === 'Signup' ? (
            <p className='text-gray-600 text-center text-sm mt-4'>
              Already have an account?{" "}
              <span onClick={() => setState('Login')} className='text-blue-600 cursor-pointer underline'>Login Here</span>
            </p>
          ) : (
            <p className='text-gray-600 text-center text-sm mt-4'>
              Don't have an account?{" "}
              <span onClick={() => setState('Signup')} className='text-blue-600 cursor-pointer underline'>Signup</span>
            </p>
          )
        }

      </div>
    </div>
  )
}

export default Login
