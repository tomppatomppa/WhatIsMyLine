import React from 'react'

interface ScriptListItemProps {
  id: string
  children?: React.ReactNode
  isActiveScript: boolean
  onClick: () => void
}

const ScriptListItem = ({ ...props }: ScriptListItemProps) => {
  const { children, isActiveScript = false, ...rest } = props

  const active = 'text-gray-900 border-indigo-600 bg-primaryLight'

  const activeClass = isActiveScript ? active : ''

  return (
    <li
      {...rest}
      className={`${activeClass} cursor-pointer flex items-center w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150`}
    >
      {children}
    </li>
  )
}
export default ScriptListItem
