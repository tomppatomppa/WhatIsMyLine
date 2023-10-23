import React from 'react'

interface ScriptListItemProps {
  id: string
  children?: React.ReactNode
  isActive: boolean
  onClick: () => void
}

const ScriptListItem = ({ ...props }: ScriptListItemProps) => {
  const { children, isActive = false } = props

  const active = 'text-gray-900 border-indigo-600'

  const activeClass = isActive ? active : ''

  return (
    <li
      {...props}
      className={`${activeClass} flex items-center w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150`}
    >
      {children}
    </li>
  )
}
export default ScriptListItem
