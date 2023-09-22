import { AiOutlineClose } from 'react-icons/ai'
import { useMutation, useQuery } from 'react-query'
import { deleteScriptById, fetchAllUserScripts } from 'src/API/scriptApi'
import EmptyScriptList from 'src/components/EmptyScriptList'
import { Script } from 'src/components/ReaderV3/reader.types'
import ScriptList from 'src/components/ScriptList'
import FileUpload from 'src/containers/FileUpload'
import {
  useDeleteScript,
  useScriptStore,
  useScripts,
  useSetActiveScriptId,
  useSetScripts,
} from 'src/store/scriptStore'
import { isCurrentUserScripts } from 'src/utils/helpers'

interface SidebarProps {
  setShowMenu: () => void
  show: boolean
}

export const Sidebar = ({ setShowMenu, show }: SidebarProps) => {
  const deleteScript = useDeleteScript()
  const setScripts = useSetScripts()
  const setActiveScript = useSetActiveScriptId()

  const { updateDatabaseWithLocalChanges, unsavedChanges } = useScriptStore()
  const scripts = useScripts()

  const { mutate } = useMutation(deleteScriptById)

  //TODO: remove, use database as only source
  useQuery(['scripts'], () => fetchAllUserScripts(), {
    onSuccess: async (data: Script[]) => {
      if (unsavedChanges && isCurrentUserScripts(data, scripts)) {
        setScripts(scripts)
      } else {
        setScripts(data)
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  })

  const activeScriptId = useScriptStore((state) => state.activeScriptId)

  const handleDeleteScript = (script_id: string) => {
    deleteScript(script_id)
    mutate(script_id)
  }

  return (
    <aside
      className={`${
        show ? 'translate-x-0' : '-translate-x-[40rem]'
      } fixed  z-50 w-full sm:w-72 shadow-lg divide-y-4 h-full translate-all duration-200 bg-white overflow-y-auto overflow-x-hidden`}
    >
      <div className="flex flex-col items-center border-black">
        <div className="flex flex-row w-full justify-end bg-primary p-2">
          <button onClick={setShowMenu}>
            <AiOutlineClose size={24} />
          </button>
        </div>
        <FileUpload />
        {scripts.length ? (
          <ScriptList
            scripts={scripts}
            unsavedChanges={unsavedChanges}
            deleteScript={handleDeleteScript}
            setActiveScript={setActiveScript}
            activeScriptId={activeScriptId}
          />
        ) : (
          <EmptyScriptList />
        )}
        <button
          disabled={!unsavedChanges.length}
          className="p-2 border mt-6"
          onClick={() => updateDatabaseWithLocalChanges()}
        >
          {!unsavedChanges.length ? 'In Sync' : 'Save Local Changes'}
        </button>
      </div>
    </aside>
  )
}
