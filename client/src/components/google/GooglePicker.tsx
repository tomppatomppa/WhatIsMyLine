import useDrivePicker from 'react-google-drive-picker'
import { useEffect } from 'react'
import { getUserFile } from 'src/API/googleApi'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

interface GooglePickerProps {
  setAccessToken?: (access_token: string) => void
  onFileSelect?: (result: File) => void
  access_token?: string
}

const GooglePicker = ({
  setAccessToken,
  access_token,
  onFileSelect,
}: GooglePickerProps) => {
  const [openPicker, authResponse] = useDrivePicker()

  const token = access_token || authResponse?.access_token || ''

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

      callbackFunction: async (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        } else if (data.docs && onFileSelect && token) {
          try {
            const result = await getUserFile(data?.docs[0].id, token)
            const file = new File([result], data.docs[0].name, {
              type: data.docs[0].mimeType,
            })
            onFileSelect(file)
          } catch (e) {
            console.log(e)
          }
        }
      },
    })
  }

  useEffect(() => {
    if (authResponse?.access_token && setAccessToken) {
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
