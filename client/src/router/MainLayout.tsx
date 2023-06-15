import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from 'src/containers/Navbar'

const MainLayout = () => {
  return (
    <div className="text-center">
      <aside>
        <Navbar />
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default MainLayout
