import { Script } from '../../ReaderV3/reader.types'

import TrashButton from '../../common/buttons/TrashButton'
import ScriptListItem from './ScriptListItem'

interface ScriptListProps {
  scripts: Script[]
  activeScriptId: string | undefined
  setActiveScript: (scriptId: string) => void
  deleteScript: (scriptId: string) => void
}

export const ScriptList = ({
  scripts,
  activeScriptId,
  setActiveScript,
  deleteScript,
}: ScriptListProps) => {
  return (
    <div className="text-gray-600 md:px-8">
      <ul className=" overflow-y-auto max-h-screen pt-6">
        {scripts?.map(({ filename, script_id }, idx) => (
          <ScriptListItem
            key={idx}
            id={`script-list-item-${idx}`}
            isActiveScript={activeScriptId === script_id}
            onClick={() => setActiveScript(script_id)}
          >
            <span className="flex-1 text-start">{filename}</span>
            <TrashButton onClick={() => deleteScript(script_id)} />
          </ScriptListItem>
        ))}
      </ul>
    </div>
  )
}
