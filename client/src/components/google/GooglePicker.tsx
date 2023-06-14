import useDrivePicker from 'react-google-drive-picker'
import { useEffect } from 'react'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

interface GooglePickerProps {
  setAccessToken: (access_token: string) => void
  access_token?: string
}
const GooglePicker = ({ setAccessToken, access_token }: GooglePickerProps) => {
  const [openPicker, authResponse] = useDrivePicker()

  const handleOpenPicker = () => {
    openPicker({
      clientId: CLIENT_ID as string,
      developerKey: API_KEY as string,
      viewId: 'PDFS',
      token: access_token || '',
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,

      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
      },
    })
  }

  useEffect(() => {
    if (authResponse?.access_token) {
      setAccessToken(authResponse.access_token)
    }
  }, [authResponse, setAccessToken])

  return (
    <button
      onClick={() => handleOpenPicker()}
      className="p-2 rounded-md bg-blue-200 my-2"
    >
      Google Drive
    </button>
  )
}

export default GooglePicker
