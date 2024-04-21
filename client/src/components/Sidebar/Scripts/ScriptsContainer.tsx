import {
  useActiveScript,
  useDeleteScript,
  useScripts,
  useSetActiveScriptId,
  useSetScripts,
} from 'src/store/scriptStore'
import { ScriptList } from './ScriptList'
import EmptyScriptList from './EmptyScriptList'
import { useQuery } from 'react-query'
import { fetchAllUserScripts } from 'src/API/scriptApi'
import { Script } from 'src/components/ReaderV3/reader.types'

import { useState } from 'react'
import { SearchBox } from '../../common/SearchBox'
import { scriptChanged } from './utils'

interface ScriptContainerProps {
  children?: React.ReactNode
  onScriptChange?: () => void
}

const ScriptsContainer = ({
  children,
  onScriptChange,
}: ScriptContainerProps) => {
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

  //TODO: remove onSuccess, move all state to reactQuery
  useQuery(['scripts'], () => fetchAllUserScripts(), {
    onSuccess: async (data: Script[]) => {
      setScripts(data)
    },
    refetchOnWindowFocus: false,
  })

  const handleSetActiveScript = (scriptId: string) => {
    if (scriptChanged(activeScript?.script_id, scriptId)) {
      onScriptChange && onScriptChange()
    }
    setActiveScript(scriptId)
  }

  const scriptProps = {
    scripts: filteredScripts,
    activeScriptId: activeScript?.script_id,
    setActiveScript: handleSetActiveScript,
    deleteScript: deleteScript,
  }

  return (
    <div className={`flex flex-col h-full w-full gap-4`}>
      {children}
      <div className="px-4 md:px-8">
        <SearchBox setSearch={setSearch} />
      </div>
      {filteredScripts.length ? (
        <ScriptList {...scriptProps} />
      ) : (
        <EmptyScriptList />
      )}
    </div>
  )
}

export default ScriptsContainer
