import { AiOutlineDelete, AiOutlineCloseCircle } from 'react-icons/ai'

import FileUpload from 'src/containers/FileUpload'

export const Sidebar = (props: any) => {
  const {
    setShowMenu,
    scripts,
    activeScriptId,
    setActiveScript,
    handleDelete,
  } = props

  const filteredScipts = scripts?.filter(
    (script: { trash: boolean }) => script.trash !== true
  )
  return (
    <div className="flex flex-col items-center border border-black">
      <div className="flex flex-row w-full bg-primary p-2">
        {/* <UploadFile /> */}
        <span className="flex-1"></span>
        <button onClick={setShowMenu}>
          <AiOutlineCloseCircle size={24} />
        </button>
      </div>
      <FileUpload />
      <div className="flex w-full flex-col">
        {filteredScipts?.map((script: any, index: number) => (
          <li
            className={`${
              activeScriptId === script.id
                ? 'text-black border-green-300'
                : 'text-gray-500'
            } cursor-pointer border-l-4 flex h-12 items-center`}
            key={index}
          >
            <span onClick={() => setActiveScript(script.id)} className="flex-1">
              {script.filename}
            </span>

            <button
              onClick={() => handleDelete(script.id)}
              className="w-6 flex-0 mx-auto flex items-center justify-center"
            >
              <AiOutlineDelete color="red" />
            </button>
          </li>
        ))}
      </div>
    </div>
  )
}
