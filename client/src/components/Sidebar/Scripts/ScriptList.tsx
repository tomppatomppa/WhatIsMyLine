import { useState } from 'react'
import { SearchBox } from './SearchBox'
import { Script } from '../../ReaderV3/reader.types'

import TrashButton from '../../common/buttons/TrashButton'

interface ScriptListItemProps {
  children?: React.ReactNode
  isActive: boolean
  className: string
  active: string
  onClick: () => void
}

const ScriptListItem = ({ ...props }: ScriptListItemProps) => {
  const { children, className = '', active = '', isActive = false } = props

  const activeClass = isActive ? active : ''

  return (
    <button {...props} className={`${activeClass} ${className}`}>
      {children}
    </button>
  )
}

interface ScriptListProps {
  scripts: Script[]
  setActiveScript: (scriptId: string) => void
  deleteScript: (scriptId: string) => void
}

export const ScriptList = ({
  scripts,
  setActiveScript,
  deleteScript,
}: ScriptListProps) => {
  const [search, setSearch] = useState('')

  const filteredScripts =
    scripts.filter(({ filename }) =>
      filename.toLowerCase().includes(search.toLowerCase())
    ) || []

  return (
    <div className="text-gray-600 md:px-8">
      <div className="px-4 md:px-8 sticky">
        <SearchBox setSearch={setSearch} />
      </div>
      <ul className=" overflow-y-auto max-h-screen pt-6">
        {filteredScripts?.map(
          ({ filename, script_id }, idx: React.Key | null | undefined) => (
            <li className="flex" key={idx}>
              <ScriptListItem
                onClick={() => setActiveScript(script_id)}
                isActive={false}
                active="text-gray-900 border-indigo-600"
                className="flex items-center w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150"
              >
                {filename}
                <p className="flex-1" />
                <TrashButton onClick={() => deleteScript(script_id)} />
              </ScriptListItem>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
