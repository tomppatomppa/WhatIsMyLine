import { useRef, useState } from 'react'

const useFile = () => {
  const [files, setFiles] = useState([])
  const inputRef = useRef(null)

  const handleAddFile = (event) => {
    const fileObj = event.target.files && event.target.files[0]
    if (!fileObj) {
      return
    }
    event.target.value = null

    if (files.some((file) => file.name === fileObj.name)) {
      alert('Duplicate name')
      return
    }
    setFiles(files.concat(fileObj))
  }
  const handleClick = () => {
    inputRef.current.click()
  }
  const reset = () => {
    setFiles([])
  }

  return { files, inputRef, handleClick, handleAddFile, reset }
}

export default useFile
