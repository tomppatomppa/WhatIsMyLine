import useDrivePicker from 'react-google-drive-picker'
import { useEffect } from 'react'
import { getFileGoogleDrive } from 'src/API/googleApi'
import { FaGoogleDrive } from 'react-icons/fa'

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

interface GooglePickerProps {
  className?: string
  setAccessToken?: (access_token: string) => void
  onFileSelect?: (result: File) => void
  access_token?: string
}

const GooglePicker = ({
  className,
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
            const result = await getFileGoogleDrive(data?.docs[0].id, token)
            const file = new File([result], data.docs[0].name, {
              type: data.docs[0].mimeType,
            })
            console.log(result)
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
    <button className={className} onClick={() => handleOpenPicker()}>
      <FaGoogleDrive size={22} />
    </button>
  )
}

export default GooglePicker
