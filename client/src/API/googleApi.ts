import axios from 'axios'
import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'
import { Script } from 'src/components/ReaderV3/reader.types'
import { BASE_URI } from 'src/config'

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
interface getSceneAudioFromScriptProps {
  scriptId: string
  sceneId: string
  access_token: string
}
export const getSceneAudioFromScript = async ({
  scriptId,
  sceneId,
  access_token,
}: getSceneAudioFromScriptProps) => {
  const { data } = await axios.get(
    `https://www.googleapis.com/drive/v3/files/${scriptId}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      responseType: 'blob',
      params: {
        alt: 'media',
      },
    }
  )
  return data
}

interface downloadFolderWithMP3Props {
  scriptId?: string
  folderId: string
  access_token: string
}

export const downloadFolderWithMP3 = async ({
  access_token,
  folderId,
}: downloadFolderWithMP3Props) => {
  const filesUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType='audio/mpeg'&access_token=${access_token}`
  const filesResponse = await fetch(filesUrl)
  const filesData = await filesResponse.json()
  const mp3Files = filesData.files

  // Return the MP3 files
  return mp3Files
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

export const createTextToSpeech = async (script: Script) => {
  const { data } = await axios.post(`${BASE_URI}/api/v3/text-to-speech`, {
    script,
  })
  return data
}
