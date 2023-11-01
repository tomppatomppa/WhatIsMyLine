import { useState } from 'react'

import { FcReadingEbook } from 'react-icons/fc'
import ScriptsContainer from './Scripts/ScriptsContainer'
import Profile from '../profile/Profile'
import ScriptsIcon from '../icons/ScriptsIcon'
import LogoutIcon from '../icons/LogoutIcon'
import SettingsIcon from '../icons/SettingsIcon'
import HelpIcon from '../icons/HelpIcon'
import { PiTrashSimpleThin } from 'react-icons/pi'
import FileUpload from 'src/components/FileUpload/FileUpload'
import SidebarList from './SidebarList'
import { useLogout } from 'src/store/userStore'

const Sidebar = () => {
  const logout = useLogout()
  const [showScripts, setShowScripts] = useState(false)

  const navigation = [
    {
      onClick: () => {
        setShowScripts(() => !showScripts)
      },
      name: 'All Scripts',
      icon: <ScriptsIcon />,
    },
    {
      onClick: () => {
        console.log('Mark script as trash')
      },
      name: 'Trash',
      icon: <PiTrashSimpleThin color="red" size={24} />,
    },
  ]

  const navigationFooter = [
    {
      onClick: () => {
        console.log('Help')
      },
      name: 'Help',
      icon: <HelpIcon />,
    },
    {
      onClick: () => {
        console.log('Settings')
      },
      name: 'Settings',
      icon: <SettingsIcon />,
    },
    {
      onClick: () => {
        logout()
      },
      name: 'Logout',
      icon: <LogoutIcon />,
    },
  ]

  return (
    <aside
      className={`sticky flex flex-row top-0 left-0 w-auto h-screen border-r bg-white space-y-8`}
    >
      <div className="flex flex-col w-12 h-full bg-gray-200">
        <div className="h-20 flex items-center justify-center">
          <button onClick={() => console.log('About')} className="flex-none">
            <FcReadingEbook size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col h-full">
          <SidebarList data={navigation} />
          <div>
            <SidebarList data={navigationFooter} />
          </div>
          <Profile />
        </div>
      </div>
      {showScripts ? (
        <ScriptsContainer>
          <FileUpload />
        </ScriptsContainer>
      ) : null}
    </aside>
  )
}

export default Sidebar
