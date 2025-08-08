import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <>
      <Navbar />
      <main className='flex flex-col items-center justify-center min-h-screen bg-[url("/bg_img.png")] bg-center bg-cover'>
        <Header />
      </main>
    </>
  )
}

export default Home
