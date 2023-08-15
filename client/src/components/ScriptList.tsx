import { Script } from './ReaderV3/reader.types'
import ScriptListItem from './ScriptListItem'

interface ScriptListProps {
  scripts: Script[]
  activeScriptId: string
  setActiveScript: (scriptId: string) => void
  deleteScript: (scriptId: string) => void
}

const ScriptList = ({
  scripts,
  activeScriptId,
  setActiveScript,
  deleteScript,
}: ScriptListProps) => {
  return (
    <div id="script-list" className="flex w-full flex-col">
      {scripts?.map((script: Script, index: number) => (
        <ScriptListItem
          key={index}
          id={`script-list-item-${index}`}
          selected={activeScriptId === script.script_id}
          script={script}
          onClick={() => setActiveScript(script.script_id)}
          onDelete={() => deleteScript(script.script_id)}
        />
      ))}
    </div>
  )
}

export default ScriptList
