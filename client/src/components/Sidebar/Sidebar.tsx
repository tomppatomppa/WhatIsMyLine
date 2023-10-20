import { useRef, useState } from 'react'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

import Footer from './Footer'

import ScriptsContainer from './ScriptsContainer'

const Sidebar = () => {
  const profileRef = useRef()
  const [showMenu, setShowMenu] = useState(false)
  const [showScripts, setShowScripts] = useState(false)
  const [isProfileActive, setIsProfileActive] = useState(false)

  const navigation = [
    {
      onClick: () => {
        setShowScripts(() => !showScripts)
      },
      href: 'javascript:void(0)',
      name: 'Scripts',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
          />
        </svg>
      ),
    },
  ]

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
    <>
      <nav
        className={`fixed flex flex-row top-0 left-0 w-auto h-full border-r bg-white space-y-8`}
      >
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center justify-center px-8">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex-none"
            >
              <BsArrowLeft size={24} />
            </button>
          </div>
          <div className="flex-1 flex flex-col h-full">
            <ul className="px-4 text-sm font-medium flex-1">
              {navigation.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={item.onClick}
                    className="relative mx-auto flex items-center justify-center gap-x-2 text-gray-600 p-2 rounded-lg  hover:bg-gray-50 active:bg-gray-100 duration-150 group"
                  >
                    <div className="text-gray-500">{item.icon}</div>
                    <span className="absolute left-14 p-1 px-1.5 rounded-md whitespace-nowrap text-xs text-white bg-gray-800 hidden group-hover:inline-block group-focus:hidden duration-150">
                      {item.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div>
              <Footer />
              <div className="relative py-4 px-4 border-t">
                <button
                  ref={profileRef as any}
                  className="w-12 h-12 flex items-center gap-x-4 cursor-pointer rounded-full ring-offset-2 ring-gray-800 focus:ring-2 duration-150"
                  onClick={() => setIsProfileActive(!isProfileActive)}
                >
                  <img
                    src="https://randomuser.me/api/portraits/women/79.jpg"
                    className="w-12 h-12 rounded-full"
                  />
                </button>
                {isProfileActive ? (
                  <div className="absolute bottom-4 left-20 w-64 rounded-lg bg-white shadow-md border text-sm text-gray-600">
                    <div className="p-2">
                      <span className="block text-gray-500/80 p-2">
                        vienna@gmail.com
                      </span>
                      <a
                        href="javascript:void(0)"
                        className="block w-full p-2 text-left rounded-md hover:bg-gray-50 active:bg-gray-100 duration-150"
                      >
                        Status
                      </a>
                      <div className="relative rounded-md hover:bg-gray-50 active:bg-gray-100 duration-150">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 absolute right-1 inset-y-0 my-auto pointer-events-none"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <select className="w-full cursor-pointer appearance-none bg-transparent p-2 outline-none">
                          <option disabled selected>
                            Theme
                          </option>
                          <option>Dark</option>
                          <option>Light</option>
                        </select>
                      </div>
                      <button className="block w-full p-2 text-left rounded-md hover:bg-gray-50 active:bg-gray-100 duration-150">
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>

        <ScriptsContainer show={showScripts} />
      </nav>
    </>
  )
}

export default Sidebar
