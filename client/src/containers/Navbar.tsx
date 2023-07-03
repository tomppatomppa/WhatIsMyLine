import { useState } from 'react'
import { Sidebar } from './Sidebar'
import Profile from 'src/components/profile/Profile'
import Dropdown from 'src/components/common/Dropdown'

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <button
        className="flex self-center m-4 text-black font-bold tracking-widest"
        onClick={() => setShowMenu(!showMenu)}
      >
        SCRIPTS
      </button>
      <span className="flex-1"></span>
      <Dropdown title="Profile">
        <Profile />
      </Dropdown>

      <Sidebar show={showMenu} setShowMenu={() => setShowMenu(false)} />
    </>
  )
}

export default Navbar
