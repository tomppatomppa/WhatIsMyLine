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

export const createFolder = async (access_token: string) => {
  let createFolderOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mimeType: 'application/vnd.google-apps.folder',
      name: 'My new google drive folder!',
    }),
  }
  const { data } = await axios.post(
    'https://www.googleapis.com/drive/v3/files',
    createFolderOptions
  )
  return data
}
