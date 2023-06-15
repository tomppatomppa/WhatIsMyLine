import { useState } from 'react'

import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import { Sidebar } from './Sidebar'

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div>
      <div className="sticky bottom-0 shadow-md  flex w-full justify-start bg-primary ">
        <button
          className="flex self-center m-4 text-black font-bold tracking-widest"
          onClick={() => setShowMenu(!showMenu)}
        >
          SCRIPTS
        </button>
        <span className="flex-1"></span>
        <GoogleLoginButton />
      </div>
      <Sidebar show={showMenu} setShowMenu={() => setShowMenu(false)} />
    </div>
  )
}

export default Navbar
