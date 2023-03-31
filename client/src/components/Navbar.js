import React, { useState } from 'react'
import useCurrentScripts from '../hooks/useCurrentScripts'
import { FileButton } from './FileLoader'
import { AiOutlineDelete, AiOutlineCloseCircle } from 'react-icons/ai'

const Navbar = ({ selected, setSelected }) => {
  const [showMenu, setShowMenu] = useState(true)
  const { currentScripts, setCurrentScripts } = useCurrentScripts()

  const handleReset = () => {
    setCurrentScripts([])
    setSelected(null)
    localStorage.removeItem('scripts')
  }

  const handleDelete = (filename) => {
    const updated_scripts = currentScripts.filter(
      (s) => s.filename !== filename
    )
    localStorage.setItem('scripts', JSON.stringify(updated_scripts))
    setCurrentScripts(updated_scripts)
  }

  return (
    <div className="w-full mb-24">
      <div className="fixed shadow-md top-0 flex w-full justify-start  bg-white">
        <button
          className="flex self-center m-4 text-black font-bold tracking-widest"
          onClick={() => setShowMenu(!showMenu)}
        >
          SCRIPTS
        </button>
      </div>
      <div
        className={`${
          showMenu ? 'translate-x-0' : '-translate-x-[30rem]'
        } fixed top-14 w-full sm:w-72 shadow-lg h-full translate-all duration-200 bg-white`}
      >
        <div className="flex flex-col items-center ">
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
                <span onClick={() => setSelected(script)} className="flex-1">
                  {index}
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
      </div>
    </div>
  )
}
const isSelected = (selectedScript, script) => {
  if (!selectedScript || !script) return false
  return selectedScript.filename === script.filename
}
export default Navbar
