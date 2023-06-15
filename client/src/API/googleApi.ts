import axios from 'axios'

type Docs = {
  id: string
  name: string
  mimeType: string
}

interface getFileGoogleDriveProps {
  docs: Docs
  access_token: string
}
export const getFileGoogleDrive = async ({
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
