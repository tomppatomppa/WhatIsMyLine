import { useState } from 'react'

import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import { Sidebar } from './Sidebar'

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
      <GoogleLoginButton />
      <Sidebar show={showMenu} setShowMenu={() => setShowMenu(false)} />
    </>
  )
}

export default Navbar
