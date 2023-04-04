import React from 'react'
import { useNavigate } from 'react-router-dom'

import useCurrentScript from '../../hooks/useCurrentScripts'

import FileLoader from './FileLoader'
import useFile from './hooks/useFile'
import useSendFiles from './hooks/useSendFiles'

const FileButton = () => {
  const navigate = useNavigate()
  const { currentScripts, setCurrentScripts } = useCurrentScript()
  const { files, inputRef, handleClick, handleAddFile, reset } = useFile()
  const { sendFiles } = useSendFiles()

  const handleSend = async () => {
    try {
      const result = await sendFiles(files)
      const updated_scripts = currentScripts.concat(result)
      setCurrentScripts(updated_scripts)
      localStorage.setItem('scripts', JSON.stringify(updated_scripts))
      navigate('/reader')
      reset()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <FileLoader
        inputRef={inputRef}
        handleClick={handleClick}
        handleAddFile={handleAddFile}
      />
      <div className="self-center">
        {files.length > 0 && (
          <button
            className="border border-action  p-1 rounded-md"
            onClick={handleSend}
          >
            Upload {files.length}
          </button>
        )}
      </div>
    </>
  )
}

export default FileButton
