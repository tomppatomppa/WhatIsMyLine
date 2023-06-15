import { AiOutlineClose } from 'react-icons/ai'
import ScriptList from 'src/components/ScriptList'

import FileUpload from 'src/containers/FileUpload'
import {
  useDeleteScript,
  useScriptStore,
  useScripts,
  useSetActiveScriptId,
} from 'src/store/scriptStore'

interface SidebarProps {
  setShowMenu: () => void
  show: boolean
}

export const Sidebar = ({ setShowMenu, show }: SidebarProps) => {
  const scripts = useScripts()
  const activeScriptId = useScriptStore((state) => state.activeScriptId)

  const deleteScript = useDeleteScript()
  const setActiveScript = useSetActiveScriptId()

  return (
    <div
      className={`${
        show ? 'translate-x-0' : '-translate-x-[40rem]'
      } fixed top-14 z-50 w-full sm:w-72 shadow-lg divide-y-4 h-full translate-all duration-200 bg-white`}
    >
      <div className="flex flex-col items-center border-black">
        <div className="flex flex-row w-full justify-end bg-primary p-2">
          <button onClick={setShowMenu}>
            <AiOutlineClose size={24} />
          </button>
        </div>
        <FileUpload />
        <ScriptList
          scripts={scripts}
          deleteScript={deleteScript}
          setActiveScript={setActiveScript}
          activeScriptId={activeScriptId}
        />
      </div>
    </div>
  )
}
