import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from 'src/containers/Navbar'

const MainLayout = () => {
  return (
    <div className="text-center">
      <nav className="sticky bottom-0 shadow-md  flex w-full justify-start bg-primary ">
        <Navbar />
      </nav>
      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default MainLayout
