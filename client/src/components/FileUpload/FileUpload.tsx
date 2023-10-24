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
import MultiFilePicker from './MultiFilePicker'

const FileUpload = () => {
  const access_token = useAccessToken() as string
  const [file, setFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const addScript = useAddScript()

  const { mutate: upload, isLoading } = useMutation(uploadfile, {
    onSuccess: (script) => {
      addScript(script)
      setFile(null)
    },
  })

  const handleUploadMany = async () => {
    files.forEach((file) => {
      const formData = new FormData()
      formData.append('file', file)
      upload(formData)
    })
  }
  console.log(files, file)
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
            <MultiFilePicker
              className=" p-2 rounded-md"
              handleFileChange={(e) => {
                if (e.target.files) {
                  const filesArray: File[] = Array.from(e.target.files)
                  setFiles(filesArray)
                }
              }}
            />
          </>
        ) : (
          <>
            <UploadButton
              disabled={isLoading}
              text={isLoading ? 'uploading...' : 'Upload'}
              show={!!file || files.length}
              upload={() => {
                if (file) {
                  const formData = new FormData()
                  formData.append('file', file)
                  upload(formData)
                }
                if (files.length) {
                  handleUploadMany()
                }
              }}
            />
            <button onClick={() => setFile(null)}>Cancel</button>
          </>
        )}
        <button onClick={handleUploadMany}>upload multi </button>
      </div>
    </div>
  )
}

export default FileUpload
