import useDrivePicker from 'react-google-drive-picker'
import { getGoogleDriveFileById } from 'src/API/googleApi'
import { FaGoogleDrive } from 'react-icons/fa'
import { useMutation } from 'react-query'
import { PickerCallback } from 'react-google-drive-picker/dist/typeDefs'
import Spinner from '../common/Spinner'
import { useAccessToken, useSetAccessToken } from 'src/store/userStore'
import { useEffect } from 'react'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

interface GooglePickerProps {
  className?: string
  onFileSelect: (result: File) => void
}

const GooglePicker = ({ className, onFileSelect }: GooglePickerProps) => {
  const [openPicker, authResponse] = useDrivePicker()
  const { mutate, isLoading } = useMutation(getGoogleDriveFileById, {
    onSuccess: (pdfFile, variables) => {
      const file = new File([pdfFile], variables.docs.name, {
        type: variables.docs.mimeType,
      })
      onFileSelect(file)
    },
  })
  //TODO: remove
  const setToken = useSetAccessToken()
  const token = useAccessToken()

  const handleOpenPicker = () => {
    openPicker({
      clientId: CLIENT_ID as string,
      developerKey: API_KEY as string,
      viewId: 'PDFS',
      token: token,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      callbackFunction: async (data: PickerCallback) => {
        if (data.action === 'picked' && token) {
          mutate({ docs: data.docs[0], access_token: token })
        }
      },
    })
  }

  //TODO: remove
  useEffect(() => {
    if (authResponse?.access_token) {
      setToken(authResponse?.access_token)
    }
  }, [authResponse, setToken])

  return isLoading ? (
    <Spinner show={isLoading} delay={400} />
  ) : (
    <button className={className} onClick={() => handleOpenPicker()}>
      <FaGoogleDrive size={22} />
    </button>
  )
}

export default GooglePicker
