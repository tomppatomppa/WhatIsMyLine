import { Outlet } from 'react-router-dom'
import Sidebar from 'src/components/Sidebar/Sidebar'
import Navbar from 'src/containers/Navbar'

const MainLayout = () => {
  return (
    <div className="text-center">
      <nav className="sticky z-10 bottom-0 shadow-md flex w-full justify-start bg-primary">
        {/* <Navbar /> */}
        <Sidebar />
      </nav>
      <section className="mr-25">
        <Outlet />
      </section>
    </div>
  )
}

export default MainLayout
