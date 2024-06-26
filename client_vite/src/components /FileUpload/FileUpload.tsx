
import { useMutation } from 'react-query'

import MultiFilePicker from './MultiFilePicker'
import Button from '../common/Button'
import { useState } from 'react'
import { uploadfile } from '../../API/uploadApi'
import { useAddScript } from '../../store/scriptStore'

const FileUpload = () => {
  const [files, setFiles] = useState<File[]>([])
  const addScript = useAddScript()

  //TODO: move state to useQuery cache
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

  if (files.length) {
    return (
      <div className="w-full h-14 items-center mb-2">
        <Button variant="secondary" onClick={handleUpload}>
          Upload
        </Button>
        <Button variant="danger" onClick={() => setFiles([])}>
          Cancel
        </Button>
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
