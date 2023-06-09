import { useState } from 'react'
import { AiOutlineDelete, AiOutlineCloseCircle } from 'react-icons/ai'
import {
  useDeleteScript,
  useScriptStore,
  useScripts,
  useSetActiveScriptFilename,
} from 'src/store/scriptStore'

import UploadFile from './FileLoader/UploadFile'

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const scripts = useScripts()
  const activeScriptFilename = useScriptStore(
    (state) => state.activeScriptFilename
  )

  const deleteScript = useDeleteScript()
  const setActiveScript = useSetActiveScriptFilename()

  return (
    <div>
      <div className="sticky bottom-0 shadow-md  flex w-full justify-start bg-primary ">
        <button
          className="flex flex-1 self-center m-4 text-black font-bold tracking-widest"
          onClick={() => setShowMenu(!showMenu)}
        >
          SCRIPTS
        </button>
      </div>
      <div
        className={`${
          showMenu ? 'translate-x-0' : '-translate-x-[40rem]'
        } fixed top-14 z-50 w-full sm:w-72 shadow-lg h-full translate-all duration-200 bg-white`}
      >
        <NavbarMenu
          scripts={scripts}
          activeScriptFilename={activeScriptFilename}
          setActiveScript={setActiveScript}
          handleDelete={deleteScript}
          setShowMenu={setShowMenu}
        />
      </div>
    </div>
  )
}
const NavbarMenu = (props: any) => {
  const {
    setShowMenu,
    scripts,
    activeScriptFilename,
    setActiveScript,
    handleDelete,
    handleReset,
  } = props
  const filteredScipts = scripts.filter(
    (script: { trash: boolean }) => script.trash !== true
  )
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-full bg-primary p-2">
        <UploadFile />
        <span className="flex-1"></span>
        <button onClick={() => setShowMenu(false)}>
          <AiOutlineCloseCircle size={24} />
        </button>
      </div>
      <div className="flex divide-y w-full flex-col p-2">
        {filteredScipts?.map((script: any, index: number) => (
          <li
            className={`${
              activeScriptFilename === script.filename
                ? 'text-black'
                : 'text-gray-500'
            } cursor-pointer p-2 list-decimal flex`}
            key={index}
          >
            <span
              onClick={() => setActiveScript(script.filename)}
              className="flex-1"
            >
              {script.filename}
            </span>
            <button
              onClick={() => handleDelete(index)}
              className="m-2 self-start"
            >
              <AiOutlineDelete color="red" />
            </button>
          </li>
        ))}
        <button
          className="flex mt-24 bg-red-400 text-black p-2 rounded-md bottom-0 self-end"
          onClick={handleReset}
        >
          Delete All
        </button>
      </div>
    </div>
  )
}

export default Navbar
