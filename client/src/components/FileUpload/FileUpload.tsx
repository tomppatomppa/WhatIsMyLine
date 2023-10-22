import { useState } from 'react'
import { uploadfile } from 'src/API/uploadApi'
import { useAddScript } from 'src/store/scriptStore'
import { useMutation } from 'react-query'
import UploadButton from 'src/components/FileUpload/UploadButton'
import { useAccessToken } from 'src/store/userStore'
import {
  GooglePicker,
  LocalFilePicker,
  TestfilePicker,
} from 'src/components/FileUpload'

const FileUpload = () => {
  const access_token = useAccessToken() as string
  const [file, setFile] = useState<File | null>(null)
  const addScript = useAddScript()

  const { mutate: upload, isLoading } = useMutation(uploadfile, {
    onSuccess: (script) => {
      addScript(script)
      setFile(null)
    },
  })

  return (
    <div className="w-full h-14 items-center p-2 flex justify-start">
      <div className="flex gap-2 w-full justify-end items-center">
        {!file ? (
          <>
            <TestfilePicker
              className=" p-2 rounded-md"
              handleFileChange={(file: File) => setFile(file)}
            />
            <GooglePicker
              className=" p-2 rounded-md"
              onFileSelect={async (file: File) => {
                if (file) setFile(file)
              }}
              access_token={access_token}
            />
            <LocalFilePicker
              className=" p-2 rounded-md"
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
                  upload(formData)
                }
              }}
            />
            <button onClick={() => setFile(null)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload
