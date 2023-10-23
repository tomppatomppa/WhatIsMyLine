import {
  useActiveScript,
  useDeleteScript,
  useScriptStore,
  useScripts,
  useSetActiveScriptId,
  useSetScripts,
} from 'src/store/scriptStore'
import { ScriptList } from './ScriptList'
import EmptyScriptList from './EmptyScriptList'
import { useQuery } from 'react-query'
import { fetchAllUserScripts } from 'src/API/scriptApi'
import { Script } from 'src/components/ReaderV3/reader.types'
import Spinner from 'src/components/common/Spinner'

interface ScriptContainerProps {
  children?: React.ReactNode
}

const ScriptsContainer = ({ children }: ScriptContainerProps) => {
  const scripts = useScripts()
  const setScripts = useSetScripts()
  const setActiveScript = useSetActiveScriptId()
  const activeScript = useActiveScript()
  const deleteScript = useDeleteScript()

  const scriptProps = {
    scripts: scripts,
    activeScriptId: activeScript?.script_id,
    setActiveScript: setActiveScript,
    deleteScript: deleteScript,
  }

  const { isFetching } = useQuery(['scripts'], () => fetchAllUserScripts(), {
    onSuccess: async (data: Script[]) => {
      setScripts(data)
    },
    refetchOnWindowFocus: false,
  })

  return (
    <div
      className={`flex flex-col h-full gap-4 ${'opacity-100 transition-opacity duration-300 max-h-96'}`}
    >
      {children}
      <Spinner show={isFetching} />
      {scripts.length ? <ScriptList {...scriptProps} /> : <EmptyScriptList />}
    </div>
  )
}

export default ScriptsContainer
