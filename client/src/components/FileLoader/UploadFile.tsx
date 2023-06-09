import { ChangeEvent, useState } from 'react'
import { uploadfile } from 'src/API/uploadApi'
import { useAddScript } from 'src/store/scriptStore'

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null)
  const addScript = useAddScript()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUploadClick = async () => {
    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const result = await uploadfile(formData)
      addScript(result)
      setFile(null)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="w-full">
      <input type="file" onChange={handleFileChange} />
      {file ? (
        <button
          className="border border-action  p-1 rounded-md"
          onClick={handleUploadClick}
        >
          Upload
        </button>
      ) : null}
    </div>
  )
}

export default UploadFile
