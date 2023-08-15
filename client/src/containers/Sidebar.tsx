import { Online } from 'react-detect-offline'
import { AiOutlineClose } from 'react-icons/ai'
import { useMutation, useQuery } from 'react-query'
import {
  deleteScriptById,
  fetchAllUserScripts,
  updateScript,
} from 'src/API/scriptApi'
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

interface SidebarProps {
  setShowMenu: () => void
  show: boolean
}

export const Sidebar = ({ setShowMenu, show }: SidebarProps) => {
  const deleteScript = useDeleteScript()
  const setScripts = useSetScripts()
  const scripts = useScripts()

  const { mutate } = useMutation(deleteScriptById)

  //TODO: proper syncing
  const { refetch } = useQuery(['scripts'], () => fetchAllUserScripts(), {
    onSuccess: async (data: Script[]) => {
      //If scripts exist on local storage, update changes in database
      if (scripts.length) {
        const remoteScriptIds = data.map((script) => script.script_id)

        const scriptsToUpdate = scripts.filter((script) =>
          remoteScriptIds.includes(script.script_id)
        )
        //Some might fail, update failed manually
        await Promise.allSettled(
          scriptsToUpdate.map(async (script) => {
            return await updateScript(script)
          })
        )
        //console.log(result, 'updated')
      } else {
        //console.log('No local files')
        setScripts(data)
      }
    },
  })

  const activeScriptId = useScriptStore((state) => state.activeScriptId)

  const handleDeleteScript = (script_id: string) => {
    deleteScript(script_id)
    mutate(script_id)
  }

  const setActiveScript = useSetActiveScriptId()

  return (
    <aside
      className={`${
        show ? 'translate-x-0' : '-translate-x-[40rem]'
      } fixed  z-50 w-full sm:w-72 shadow-lg divide-y-4 h-full translate-all duration-200 bg-white`}
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
            deleteScript={handleDeleteScript}
            setActiveScript={setActiveScript}
            activeScriptId={activeScriptId}
          />
        ) : (
          <EmptyScriptList />
        )}
      </div>
      <Online
        onChange={(online) => {
          if (online) refetch()
        }}
      />
    </aside>
  )
}
