import React from 'react'

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
    <>
      <button {...props} className={`${activeClass} ${className}`}>
        {children}
      </button>
    </>
  )
}
export default ScriptListItem
