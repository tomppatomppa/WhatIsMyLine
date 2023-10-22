import React from 'react'
import { useLogout } from 'src/store/userStore'
import SidebarButton from './SidebarButton'
import LogoutIcon from '../icons/LogoutIcon'
import SettingsIcon from '../icons/SettingsIcon'
import HelpIcon from '../icons/HelpIcon'

const SidebarFooter = () => {
  const logout = useLogout()

  const navsFooter = [
    {
      onclick: () => console.log('Help'),
      name: 'Help',
      icon: <HelpIcon />,
    },
    {
      onclick: () => console.log('Settings'),
      name: 'Settings',
      icon: <SettingsIcon />,
    },
    {
      onclick: () => logout(),
      name: 'Logout',
      icon: <LogoutIcon />,
    },
  ]

  return (
    <ul className="px-4 pb-4 text-sm font-medium">
      {navsFooter.map(({ onclick, name, icon }, idx) => (
        <li key={idx}>
          <SidebarButton onClick={onclick}>
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

export default SidebarFooter
