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
import { useState } from 'react'
import { SearchBox } from './SearchBox'

interface ScriptContainerProps {
  children?: React.ReactNode
}

const ScriptsContainer = ({ children }: ScriptContainerProps) => {
  const [search, setSearch] = useState('')
  const scripts = useScripts()
  const setScripts = useSetScripts()
  const setActiveScript = useSetActiveScriptId()
  const activeScript = useActiveScript()
  const deleteScript = useDeleteScript()

  const filteredScripts =
    scripts.filter(({ filename }) =>
      filename.toLowerCase().includes(search.toLowerCase())
    ) || []

  const scriptProps = {
    scripts: filteredScripts,
    activeScriptId: activeScript?.script_id,
    setActiveScript: setActiveScript,
    deleteScript: deleteScript,
  }

  useQuery(['scripts'], () => fetchAllUserScripts(), {
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
      <div className="px-4 md:px-8 sticky">
        <SearchBox setSearch={setSearch} />
      </div>
      {scripts.length ? <ScriptList {...scriptProps} /> : <EmptyScriptList />}
    </div>
  )
}

export default ScriptsContainer
