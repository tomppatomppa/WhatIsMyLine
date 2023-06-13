import { useState } from 'react'
import { AiOutlineDelete, AiOutlineCloseCircle } from 'react-icons/ai'
import {
  useDeleteScript,
  useScriptStore,
  useScripts,
  useSetActiveScriptId,
} from 'src/store/scriptStore'

import UploadFile from './FileLoader/UploadFile'

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
          className="flex flex-1 self-center m-4 text-black font-bold tracking-widest"
          onClick={() => setShowMenu(!showMenu)}
        >
          SCRIPTS
        </button>
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

const Sidebar = (props: any) => {
  const {
    setShowMenu,
    scripts,
    activeScriptId,
    setActiveScript,
    handleDelete,
  } = props

  const filteredScipts = scripts?.filter(
    (script: { trash: boolean }) => script.trash !== true
  )
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-full bg-primary p-2">
        <UploadFile />
        <span className="flex-1"></span>
        <button onClick={setShowMenu}>
          <AiOutlineCloseCircle size={24} />
        </button>
      </div>
      <div className="flex w-full flex-col p-1">
        {filteredScipts?.map((script: any, index: number) => (
          <li
            className={`${
              activeScriptId === script.id
                ? 'text-black  border-green-300'
                : 'text-gray-500'
            } cursor-pointer border-l-2 list-decimal flex`}
            key={index}
          >
            <span onClick={() => setActiveScript(script.id)} className="flex-1">
              {script.filename}
            </span>

            <button onClick={() => handleDelete(script.id)} className="m-2">
              <AiOutlineDelete color="red" />
            </button>
          </li>
        ))}
      </div>
    </div>
  )
}

export default Navbar
