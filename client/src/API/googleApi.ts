import axios from 'axios'
import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'

interface getFileGoogleDriveProps {
  docs: CallbackDoc
  access_token: string
}
export const getGoogleDriveFileById = async ({
  docs,
  access_token,
}: getFileGoogleDriveProps) => {
  const { data } = await axios.get(
    `https://www.googleapis.com/drive/v3/files/${docs.id}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      responseType: 'arraybuffer',
      params: {
        alt: 'media',
      },
    }
  )

  return data
}
