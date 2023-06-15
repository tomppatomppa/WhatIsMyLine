import axios from 'axios'

export const getFileGoogleDrive = async (
  fileId: string,
  access_token: string
) => {
  const { data } = await axios.get(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
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
