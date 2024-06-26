import { ResponseType } from 'axios'
import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'
import { httpClient } from '../utils/axiosClient'
import { Line, Scene } from '../components /ReaderV3/reader.types'
import { BASE_URI } from '../config'

interface getGoogleDriveFileByIdProps {
  docs: CallbackDoc
  access_token: string
  responseType?: ResponseType
}
export const getGoogleDriveFileById = async ({
  docs,
  access_token,
  responseType = 'arraybuffer',
}: getGoogleDriveFileByIdProps) => {
  const { data } = await httpClient.get(
    `https://www.googleapis.com/drive/v3/files/${docs.id}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      responseType: responseType,
      params: {
        alt: 'media',
      },
    }
  )

  return data
}

interface downloadAudioFilesInSceneProps {
  rootId: string
  scriptId: string
  sceneId: string
  lines: Line[]
}

export const downloadSceneAudio = async ({
  rootId,
  scriptId,
  sceneId,
  lines,
}: downloadAudioFilesInSceneProps) => {
  const { data } = await httpClient.post(`${BASE_URI}/drive/download`, {
    rootId,
    scriptId,
    sceneId,
    lines,
  })

  return data
}

interface CreateTextToSpeechSceneProps {
  scriptId: string
  scene: Scene
  rootFolderId: string
}
/**
 * Creates a text to speech audio file from a scene
 * @returns The ids of the audio files uploaded to google drive
 */
export const createTextToSpeechFromScene = async ({
  scriptId,
  scene,
  rootFolderId,
}: CreateTextToSpeechSceneProps) => {
  const { data } = await httpClient.post(`${BASE_URI}/drive/scene-to-speech`, {
    id: scriptId,
    scenes: [scene],
    rootFolderId,
  })

  return data
}

/**
 * Creates a root folder for the user if it doesn't exist
 * @returns The id and name of the root folder
 */
export const syncGoogleDrive = async () => {
  const folderName = 'dramatify-pdf-reader' //TODO: pass as param
  const { data } = await httpClient.post(
    `${BASE_URI}/drive/create_root_folder`,
    { folderName }
  )

  return data
}
