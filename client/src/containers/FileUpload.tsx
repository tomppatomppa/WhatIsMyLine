import { useState } from 'react'
import { uploadfile } from 'src/API/uploadApi'
import { useAddScript } from 'src/store/scriptStore'

import { useMutation } from 'react-query'
import GooglePicker from 'src/components/FileUpload/GooglePicker'
import UploadButton from 'src/components/FileUpload/UploadButton'
import LocalFilePicker from 'src/components/FileUpload/LocalFilePicker'
import {
  downloadFolderWithMP3,
  getSceneAudioFromScript,
} from 'src/API/googleApi'
import { useAccessToken } from 'src/store/userStore'

const testfile = {
  scriptId: '35a2f575-6fff-4f93-b3c2-5e17f0235b31',
  sceneId: '7701 INT. KÄLLAREN',
}

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null)
  const addScript = useAddScript()
  const access_token = useAccessToken()
  const { mutate: upload, isLoading } = useMutation(uploadfile, {
    onSuccess: (script) => {
      addScript(script)
      setFile(null)
    },
  })

  const { mutate } = useMutation(downloadFolderWithMP3, {
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  console.log(access_token)

  return (
    <div className="w-full h-14 bg-gray-700 text-white items-center p-2 flex justify-start">
      <div className="flex-1 text-start">{file ? '' : 'Upload File'}</div>
      <div className="flex gap-2">
        {!file ? (
          <>
            <button
              onClick={() => {
                if (access_token) {
                  mutate({
                    scriptId: '1DYmk4uAwIPTmVptATCTD9yhsD1sRwbmG',
                    access_token,
                  })
                }
              }}
            >
              get data
            </button>
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
                  upload(formData)
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
