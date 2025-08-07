import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Signup')
  const navigate = useNavigate()

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    axios.defaults.withCredentials = true

    try {
      if (state === 'Signup') {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password })
        if (data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password })
        if (data.success) {
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-white">
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 w-24 sm:w-28 cursor-pointer"
      />
      <div className="w-full sm:w-96 bg-gray-100 p-6 rounded-md shadow text-sm text-gray-800">
        <h2 className="text-2xl font-semibold text-center mb-2">
          {state === 'Signup' ? 'Create Account' : 'Login'}
        </h2>
        <p className="text-center text-gray-500 mb-5">
          {state === 'Signup' ? 'Create your account' : 'Login to your account'}
        </p>

        <form onSubmit={onSubmitHandler}>
          {state === 'Signup' && (
            <div className="flex items-center gap-3 mb-4 px-4 py-2 border rounded-md bg-white">
              <img src={assets.person_icon} alt="person" className="w-5" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-transparent outline-none"
                required
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 px-4 py-2 border rounded-md bg-white">
            <img src={assets.mail_icon} alt="mail" className="w-5" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Id"
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          <div className="flex items-center gap-3 mb-4 px-4 py-2 border rounded-md bg-white">
            <img src={assets.lock_icon} alt="lock" className="w-5" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent outline-none"
              required
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className="mb-4 text-blue-600 text-right cursor-pointer"
          >
            Forgot Password?
          </p>

          <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition">
            {state}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {state === 'Signup' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-blue-600 cursor-pointer underline"
              >
                Login Here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span
                onClick={() => setState('Signup')}
                className="text-blue-600 cursor-pointer underline"
              >
                Signup
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default Login
