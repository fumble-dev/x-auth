import React from 'react'
import {assets} from '../assets/assets.js'

const Navbar = () => {
  return (
    <div className=' w-full flex sm:p-6 sm:px-24 absolute top-0 justify-between items-center'>
      <img src={assets.logo} alt="" className='w-28 sm:w-32' />

      <button className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer'>Login <img src={assets.arrow_icon} alt="" /></button>
    </div>
  )
}

export default Navbar
