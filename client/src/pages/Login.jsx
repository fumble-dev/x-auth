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
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    axios.defaults.withCredentials = true

    try {
      const url = `${backendUrl}/api/auth/${state === 'Signup' ? 'register' : 'login'}`
      const payload = state === 'Signup' ? { name, email, password } : { email, password }

      const { data } = await axios.post(url, payload)

      if (data.success) {
        setIsLoggedIn(true)
        await getUserData()
        toast.success(data.message)
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white px-6 py-12">
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 w-24 sm:w-28 cursor-pointer select-none"
        aria-label="Go to homepage"
      />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 sm:p-12 text-gray-800">
        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide text-indigo-700">
          {state === 'Signup' ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-500 mb-10 text-base sm:text-lg">
          {state === 'Signup'
            ? 'Join us today! Enter your details below.'
            : 'Log in to access your account.'}
        </p>

        <form onSubmit={onSubmitHandler} noValidate>
          {state === 'Signup' && (
            <div className="flex items-center gap-3 mb-6 px-5 py-3 border border-gray-300 rounded-xl bg-gray-50 focus-within:ring-4 focus-within:ring-indigo-300 transition">
              <img src={assets.person_icon} alt="Full Name" className="w-6" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
                required
                autoComplete="name"
                disabled={loading}
                aria-label="Full Name"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-6 px-5 py-3 border border-gray-300 rounded-xl bg-gray-50 focus-within:ring-4 focus-within:ring-indigo-300 transition">
            <img src={assets.mail_icon} alt="Email" className="w-6" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
              required
              autoComplete="email"
              disabled={loading}
              aria-label="Email Address"
            />
          </div>

          <div className="flex items-center gap-3 mb-8 px-5 py-3 border border-gray-300 rounded-xl bg-gray-50 focus-within:ring-4 focus-within:ring-indigo-300 transition">
            <img src={assets.lock_icon} alt="Password" className="w-6" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
              required
              autoComplete={state === 'Signup' ? 'new-password' : 'current-password'}
              disabled={loading}
              aria-label="Password"
            />
          </div>

          <div className="flex justify-between items-center mb-8 text-sm sm:text-base">
            <p
              onClick={() => navigate('/reset-password')}
              className="text-indigo-600 hover:text-indigo-700 cursor-pointer select-none font-medium transition"
              tabIndex={0}
              role="button"
              onKeyPress={e => e.key === 'Enter' && navigate('/reset-password')}
            >
              Forgot Password?
            </p>

            <p className="text-gray-600 select-none text-sm sm:text-base">
              {state === 'Signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span
                onClick={() => setState(state === 'Signup' ? 'Login' : 'Signup')}
                className="text-indigo-600 hover:text-indigo-700 cursor-pointer underline select-none font-semibold transition"
                tabIndex={0}
                role="button"
                onKeyPress={e => e.key === 'Enter' && setState(state === 'Signup' ? 'Login' : 'Signup')}
              >
                {state === 'Signup' ? 'Login Here' : 'Signup Here'}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              loading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
            }`}
            aria-live="polite"
          >
            {loading ? (state === 'Signup' ? 'Signing up...' : 'Logging in...') : state}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
