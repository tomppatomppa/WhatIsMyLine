import { Outlet } from 'react-router-dom'
import Sidebar from 'src/components/Sidebar/Sidebar'

const MainLayout = () => {
  return (
    <div className="text-center flex flex-row">
      <nav className="z-10 bottom-0 shadow-md flex justify-start bg-primary">
        <Sidebar />
      </nav>
      <section className="flex-1">
        <Outlet />
      </section>
    </div>
  )
}

export default MainLayout
