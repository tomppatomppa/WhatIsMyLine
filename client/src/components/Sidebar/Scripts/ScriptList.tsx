import { useState } from 'react'
import { SearchBox } from './SearchBox'
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
        {scripts?.map(
          ({ filename, script_id }, idx: React.Key | null | undefined) => (
            <li className="flex" key={idx}>
              <ScriptListItem
                onClick={() => setActiveScript(script_id)}
                isActive={activeScriptId === script_id}
                active="text-gray-900 border-indigo-600"
                className="flex items-center w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150"
              >
                {filename}
              </ScriptListItem>
              <TrashButton onClick={() => deleteScript(script_id)} />
            </li>
          )
        )}
      </ul>
    </div>
  )
}
