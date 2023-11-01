import React from 'react'
import SidebarButton from './SidebarButton'

export type SideBarItem = {
  onClick: () => void
  name: string
  icon: React.ReactNode
}

interface SidebarListProps {
  data: SideBarItem[]
}

const SidebarList = ({ data }: SidebarListProps) => {
  return (
    <ul className="text-sm font-medium flex-1">
      {data.map(({ onClick, icon, name }, idx) => (
        <li key={idx}>
          <SidebarButton onClick={onClick}>
            <div className="text-gray-500">{icon}</div>
            <span className="absolute left-14 p-1 px-1.5 rounded-md whitespace-nowrap text-xs text-white bg-gray-800 hidden group-hover:inline-block group-focus:hidden duration-150">
              {name}
            </span>
          </SidebarButton>
        </li>
      ))}
    </ul>
  )
}

export default SidebarList
