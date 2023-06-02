import { useEffect, useState } from 'react'
import useCurrentScripts from '../hooks/useCurrentScripts'
import { FileButton } from './FileLoader'
import { AiOutlineDelete, AiOutlineCloseCircle } from 'react-icons/ai'

import SelectScene from './SelectScene'

const Navbar = ({ selected, setSelected }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [menuItems, setMenuItems] = useState([])
  const { setShowScenes, currentScripts, setCurrentScripts } =
    useCurrentScripts()

  const handleReset = () => {
    setCurrentScripts([])
    setSelected(null)
    setMenuItems([])
    setShowScenes([])
    localStorage.removeItem('scripts')
  }
  const handleSelect = (file) => {
    setSelected(file)
    const title = file.scenes.map((item) => {
      const selectOptions = {
        label: item.id,
        value: item.id,
      }
      return selectOptions
    })
    setMenuItems(title)
    setShowMenu(false)
  }

  const handleDelete = (filename) => {
    const updated_scripts = currentScripts.filter(
      (s) => s.filename !== filename
    )
    localStorage.setItem('scripts', JSON.stringify(updated_scripts))
    setCurrentScripts(updated_scripts)
  }
  useEffect(() => {
    if (!selected && currentScripts.length > 0) {
      setSelected(currentScripts[0])
    }
  }, [])
  return (
    <div className="w-full sticky z-[90000]">
      <div className="fixed shadow-md top-0 flex w-full justify-start bg-primary ">
        <button
          className="flex flex-1 self-center m-4 text-black font-bold tracking-widest"
          onClick={() => setShowMenu(!showMenu)}
        >
          SCRIPTS
        </button>
        <SelectScene menuItems={menuItems} />
      </div>
      <div
        className={`${
          showMenu ? 'translate-x-0' : '-translate-x-[40rem]'
        } fixed top-14 z-50 w-full sm:w-72 shadow-lg h-full translate-all duration-200 bg-white`}
      >
        <NavbarMenu
          currentScripts={currentScripts}
          selected={selected}
          handleSelect={handleSelect}
          handleDelete={handleDelete}
          handleReset={handleReset}
          setShowMenu={setShowMenu}
        />
      </div>
    </div>
  )
}
const NavbarMenu = (props) => {
  const {
    setShowMenu,
    currentScripts,
    selected,
    handleSelect,
    handleDelete,
    handleReset,
  } = props

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-full bg-primary p-2">
        <FileButton />
        <span className="flex-1"></span>
        <button onClick={() => setShowMenu(false)}>
          <AiOutlineCloseCircle size={24} />
        </button>
      </div>
      <div className="flex divide-y w-full flex-col p-2">
        {currentScripts?.map((script, index) => (
          <li
            className={`${
              isSelected(selected, script) ? 'text-black' : 'text-gray-500'
            } cursor-pointer p-2 list-decimal flex`}
            key={index}
          >
            <span onClick={() => handleSelect(script)} className="flex-1">
              {script.filename}
            </span>
            <button
              onClick={() => handleDelete(script.filename)}
              className="m-2 self-start"
            >
              <AiOutlineDelete color="red" />
            </button>
          </li>
        ))}
        <button
          className="flex mt-24 bg-red-400 text-black p-2 rounded-md bottom-0 self-end"
          onClick={handleReset}
        >
          Delete All
        </button>
      </div>
    </div>
  )
}

const isSelected = (selectedScript, script) => {
  if (!selectedScript || !script) return false
  return selectedScript.filename === script.filename
}
export default Navbar
