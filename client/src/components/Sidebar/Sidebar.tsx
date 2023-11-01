import { useState } from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

import ScriptsContainer from './Scripts/ScriptsContainer'
import SidebarFooter from './SidebarFooter'
import SidebarButton from './SidebarButton'
import Profile from '../profile/Profile'
import ScriptsIcon from '../icons/ScriptsIcon'
import FileUpload from 'src/components/FileUpload/FileUpload'

const Sidebar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [showScripts, setShowScripts] = useState(false)

  const navigation = [
    {
      onClick: () => {
        setShowScripts(() => !showScripts)
      },
      name: 'All Scripts',
      icon: <ScriptsIcon />,
    },
  ]

  //TODO: Ask user if this is needed
  if (!showMenu) {
    return (
      <button
        className="fixed top-5 h-12 left-0 rounded-md  border-r bg-white space-y-8"
        onClick={() => setShowMenu(!showMenu)}
      >
        <BsArrowRight size={24} />
      </button>
    )
  }

  return (
    <aside
      className={`sticky flex flex-row top-0 left-0 w-auto h-screen border-r bg-white space-y-8`}
    >
      <div className="flex flex-col h-full bg-gray-200">
        <div className="h-20 flex items-center justify-center px-8">
          <button onClick={() => setShowMenu(!showMenu)} className="flex-none">
            <BsArrowLeft size={24} />
          </button>
        </div>
        <div className="flex-1 flex flex-col h-full">
          <ul className="px-4 text-sm font-medium flex-1">
            {navigation.map((item, idx) => (
              <li key={idx}>
                <SidebarButton onClick={item.onClick}>
                  <div className="text-gray-500">{item.icon}</div>
                  <span className="absolute left-14 p-1 px-1.5 rounded-md whitespace-nowrap text-xs text-white bg-gray-800 hidden group-hover:inline-block group-focus:hidden duration-150">
                    {item.name}
                  </span>
                </SidebarButton>
              </li>
            ))}
          </ul>
          <div>
            <SidebarFooter />
            <Profile />
          </div>
        </div>
      </div>
      {/* {'If more menu items, add context'} */}

      {showScripts ? (
        <ScriptsContainer>
          <FileUpload />
        </ScriptsContainer>
      ) : null}
    </aside>
  )
}

export default Sidebar
