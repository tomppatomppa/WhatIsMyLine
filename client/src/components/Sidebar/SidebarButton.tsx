import React from 'react'

interface SidebarButtonProps {
  onClick: () => void
  children: React.ReactNode
}

const SidebarButton = ({ onClick, children }: SidebarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative mx-auto flex items-center justify-center gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 active:bg-gray-100 duration-150 group"
    >
      {children}
    </button>
  )
}

export default SidebarButton
