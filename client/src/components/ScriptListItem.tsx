import { Script } from './ReaderV3/reader.types'
import { AiOutlineDelete } from 'react-icons/ai'

interface ScriptListItemProps {
  id: string
  selected: boolean
  script: Script
  onClick: () => void
  onDelete: () => void
}
const ScriptListItem = ({
  id,
  selected,
  script,
  onClick,
  onDelete,
}: ScriptListItemProps) => {
  return (
    <li
      id={id}
      onClick={onClick}
      className={`${
        selected ? 'text-black border-green-300' : 'text-gray-500'
      } cursor-pointer border-l-4 flex h-24 hover:bg-gray-200 items-center`}
      key={script.id}
    >
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
