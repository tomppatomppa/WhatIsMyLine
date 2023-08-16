import { useState } from 'react'
import { Sidebar } from './Sidebar'
import Profile from 'src/components/profile/Profile'
import Dropdown from 'src/components/common/Dropdown'

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <nav className="z-50 flex justify-netween w-full">
      <button
        className="flex self-center m-4 text-black font-bold tracking-widest"
        onClick={() => setShowMenu(!showMenu)}
      >
        SCRIPTS
      </button>

      <label className="flex-1"></label>
      <Dropdown className="right-2" title="Profile">
        <Profile />
      </Dropdown>
      <Sidebar show={showMenu} setShowMenu={() => setShowMenu(false)} />
    </nav>
  )
}

export default Navbar
