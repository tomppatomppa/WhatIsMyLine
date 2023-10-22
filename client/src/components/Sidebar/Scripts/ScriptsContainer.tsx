import {
  useDeleteScript,
  useScripts,
  useSetActiveScriptId,
} from 'src/store/scriptStore'
import { ScriptList } from './ScriptList'
import EmptyScriptList from '../../EmptyScriptList'

interface ScriptContainerProps {
  show: boolean
}

const ScriptsContainer = ({ show }: ScriptContainerProps) => {
  const scripts = useScripts()
  const setActiveScript = useSetActiveScriptId()
  const deleteScript = useDeleteScript()

  const scriptProps = {
    scripts: scripts,
    setActiveScript: setActiveScript,
    deleteScript: deleteScript,
  }

  return show ? (
    <div
      className={`flex flex-col h-full ${
        show
          ? 'opacity-100 transition-opacity duration-300 max-h-96'
          : 'opacity-0 transition-opacity duration-300 max-h-0'
      }`}
    >
      {scripts.length ? <ScriptList {...scriptProps} /> : <EmptyScriptList />}
    </div>
  ) : null
}

export default ScriptsContainer
