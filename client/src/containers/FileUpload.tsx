import { useState } from 'react'
import { uploadfile } from 'src/API/uploadApi'
import { useAddScript } from 'src/store/scriptStore'

import { useMutation } from 'react-query'
import GooglePicker from 'src/components/FileUpload/GooglePicker'
import UploadButton from 'src/components/FileUpload/UploadButton'
import LocalFilePicker from 'src/components/FileUpload/LocalFilePicker'

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const addScript = useAddScript()

  const { mutate, isLoading } = useMutation(uploadfile, {
    onSuccess: (script) => {
      addScript(script)
      setFile(null)
    },
  })

  return (
    <div className="w-full bg-gray-700 text-white items-center p-2 flex justify-start">
      <div className="flex-1 text-start">{file ? '' : 'Upload PDF'}</div>
      <div className="flex gap-2">
        {!file ? (
          <>
            <GooglePicker
              className="hover:bg-gray-600 p-2 rounded-md"
              onFileSelect={async (file: File) => {
                if (file) setFile(file)
              }}
            />
            <LocalFilePicker
              className="hover:bg-gray-600 p-2 rounded-md"
              handleFileChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0])
                }
              }}
            />
          </>
        ) : (
          <>
            <UploadButton
              disabled={isLoading}
              text={isLoading ? 'uploading...' : 'Upload'}
              show={!!file}
              upload={() => {
                if (file) {
                  const formData = new FormData()
                  formData.append('file', file)
                  mutate(formData)
                }
              }}
            />
            <button onClick={() => setFile(null)}>cancel</button>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload
