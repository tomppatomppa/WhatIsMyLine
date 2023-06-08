
import useFile from './hooks/useFile'
import useSendFiles from './hooks/useSendFiles'
import {useAddScript} from '../../store/scriptStore'
import FileLoader from './FileLoader'

const FileButton = () => {
  const { files, inputRef, handleClick, handleAddFile, reset } = useFile()
  const { sendFiles } = useSendFiles()
  const addScript = useAddScript()
  
  const handleSend = async () => {
    try {
      const result = await sendFiles(files)
      addScript(result as any)
      const foundScripts = JSON.parse(localStorage.getItem('scripts') as string) || []
      localStorage.setItem('scripts', JSON.stringify(foundScripts.concat(result)) )
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
      {files.length > 0 ? (
        <button
          className="border border-action  p-1 rounded-md"
          onClick={handleSend}
        >
          Upload {files.length}
        </button>
      ) : null}
    </>
  )
}

export default FileButton
