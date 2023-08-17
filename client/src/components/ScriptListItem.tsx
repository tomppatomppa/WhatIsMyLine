import { Script } from './ReaderV3/reader.types'
import { AiOutlineDelete } from 'react-icons/ai'
import Tooltip from './common/Tooltip'

interface ScriptListItemProps {
  id: string
  selected: boolean
  unsavedChanges: boolean
  script: Script
  onClick: () => void
  onDelete: () => void
}

const ScriptListItem = ({
  id,
  selected,
  unsavedChanges,
  script,
  onClick,
  onDelete,
}: ScriptListItemProps) => {
  return (
    <li
      id={id}
      onClick={onClick}
      className={`${
        selected ? 'text-black border-green-300 bg-green-200' : 'text-gray-500'
      } cursor-pointer border-l-4 flex h-8 hover:bg-gray-200 items-center`}
      key={script.script_id}
    >
      {unsavedChanges ? (
        <Tooltip text="Unsaved Changes">
          <p className="text-red-900 text-xl font-bold mx-2">!</p>
        </Tooltip>
      ) : null}
      <span className="flex-1">{script.filename}</span>
      <button
        onClick={onDelete}
        className="w-6 flex-0 mx-auto flex items-center justify-center"
      >
        <AiOutlineDelete color="red" />
      </button>
    </li>
  )
}

export default ScriptListItem
