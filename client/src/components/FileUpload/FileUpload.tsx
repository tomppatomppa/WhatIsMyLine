import { useState } from 'react'
import { uploadfile } from 'src/API/uploadApi'
import { useAddScript } from 'src/store/scriptStore'
import { useMutation } from 'react-query'

import MultiFilePicker from './MultiFilePicker'
import Button from '../common/Button'

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([])
  const filesToUpload = files.length > 0

  const addScript = useAddScript()

  const { mutate: upload } = useMutation(uploadfile, {
    onSuccess: (script) => {
      addScript(script)
    },
  })

  const handleUpload = () => {
    files.forEach((file) => {
      const formData = new FormData()
      formData.append('file', file)
      upload(formData)
    })
    setFiles([])
  }

  if (filesToUpload) {
    return (
      <div className="w-full h-14 items-center p-2">
        <Button onClick={handleUpload}>Upload</Button>
        <Button onClick={() => setFiles([])}>Cancel</Button>
      </div>
    )
  }

  return (
    <div className="w-full h-14 items-center p-2 flex justify-start">
      <div className="flex gap-2 w-full justify-end items-center">
        <MultiFilePicker
          className=" p-2 rounded-md"
          handleFileChange={(e) => {
            if (e.target.files) {
              const filesArray: File[] = Array.from(e.target.files)
              setFiles(filesArray)
            }
          }}
        />
      </div>
    </div>
  )
}

export default FileUpload
