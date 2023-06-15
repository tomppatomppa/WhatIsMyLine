import { Script } from './ReaderV3/reader.types'
import { AiOutlineDelete } from 'react-icons/ai'

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
    <div className="flex w-full flex-col">
      {scripts?.map((script: Script, index: number) => (
        <li
          className={`${
            activeScriptId === script.id
              ? 'text-black border-green-300'
              : 'text-gray-500'
          } cursor-pointer border-l-4 flex h-24 hover:bg-gray-200 items-center`}
          key={index}
        >
          <span onClick={() => setActiveScript(script.id)} className="flex-1">
            {script.filename}
          </span>
          <button
            onClick={() => deleteScript(script.id)}
            className="w-6  flex-0 mx-auto flex items-center justify-center"
          >
            <AiOutlineDelete color="red" />
          </button>
        </li>
      ))}
    </div>
  )
}

export default ScriptList
