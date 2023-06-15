import { useState } from 'react'
import { AiOutlineDelete, AiOutlineCloseCircle } from 'react-icons/ai'
import {
  useDeleteScript,
  useScriptStore,
  useScripts,
  useSetActiveScriptId,
} from 'src/store/scriptStore'
import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import { Sidebar } from './Sidebar'

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const scripts = useScripts()
  const activeScriptId = useScriptStore((state) => state.activeScriptId)

  const deleteScript = useDeleteScript()
  const setActiveScript = useSetActiveScriptId()

  return (
    <div>
      <div className="sticky bottom-0 shadow-md  flex w-full justify-start bg-primary ">
        <button
          className="flex  self-center m-4 text-black font-bold tracking-widest"
          onClick={() => setShowMenu(!showMenu)}
        >
          SCRIPTS
        </button>
        <span className="flex-1"></span>
        <GoogleLoginButton />
      </div>
      <div
        className={`${
          showMenu ? 'translate-x-0' : '-translate-x-[40rem]'
        } fixed top-14 z-50 w-full sm:w-72 shadow-lg divide-y-4 h-full translate-all duration-200 bg-white`}
      >
        <Sidebar
          scripts={scripts}
          activeScriptId={activeScriptId}
          setActiveScript={setActiveScript}
          handleDelete={deleteScript}
          setShowMenu={() => setShowMenu(false)}
        />
      </div>
    </div>
  )
}

export default Navbar
