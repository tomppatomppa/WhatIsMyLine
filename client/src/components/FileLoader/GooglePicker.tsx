import useDrivePicker from 'react-google-drive-picker'
import { useEffect } from 'react'
import { getFileGoogleDrive } from 'src/API/googleApi'
import { FaGoogleDrive } from 'react-icons/fa'
import { useMutation } from 'react-query'
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

interface GooglePickerProps {
  className?: string
  onFileSelect: (result: File) => void
  access_token?: string
}

const GooglePicker = ({
  className,
  access_token,
  onFileSelect,
}: GooglePickerProps) => {
  const [openPicker, authResponse] = useDrivePicker()
  const { mutate } = useMutation(getFileGoogleDrive, {
    onSuccess: (pdfFile, variables) => {
      const file = new File([pdfFile], variables.docs.name, {
        type: variables.docs.mimeType,
      })
      onFileSelect(file)
    },
  })

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

      callbackFunction: async (data: any) => {
        if (data.action === 'picked') {
          mutate({ docs: data.docs[0], access_token: token })
        }
      },
    })
  }

  return (
    <button className={className} onClick={() => handleOpenPicker()}>
      <FaGoogleDrive size={22} />
    </button>
  )
}

export default GooglePicker
