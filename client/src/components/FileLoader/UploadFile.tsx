import { ChangeEvent, useState, useRef } from 'react'
import { uploadfile } from 'src/API/uploadApi'
import { useAddScript } from 'src/store/scriptStore'

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const addScript = useAddScript()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUploadClick = async () => {
    if (!file || !inputRef.current) {
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await uploadfile(formData)
      addScript(result)
    } catch (e) {
      console.log(e)
    }
    setFile(null)
    inputRef.current.value = ''
  }

  return (
    <div className="w-24">
      <input ref={inputRef} type="file" onChange={handleFileChange} />
      {file ? (
        <button
          className="border my-2 border-action p-1 rounded-md"
          onClick={handleUploadClick}
        >
          Upload
        </button>
      ) : null}
    </div>
  )
}

export default UploadFile
