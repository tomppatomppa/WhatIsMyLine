import axios, { ResponseType } from 'axios'
import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'
import { Line, Scene } from 'src/components/ReaderV3/reader.types'
import {
  arrayBufferIntoHTMLAudioElement,
  extractAudioFileNames,
  hasRequiredAudioFiles,
} from 'src/components/ReaderV3/utils'
import { BASE_URI } from 'src/config'
import { httpClient, updateAccessToken } from 'src/utils/axiosClient'

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

interface findFolderWithAudioProps {
  access_token: string
  folderId: string
}
const findFolderWithAudio = async ({
  access_token,
  folderId,
}: findFolderWithAudioProps) => {
  const { data } = await axios.get(
    'https://www.googleapis.com/drive/v3/files',
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
      params: {
        q: `'${folderId}' in parents and mimeType='audio/mpeg' and trashed=false`,
        fields: 'files(id, name)',
      },
    }
  )
  return data
}

interface findFolderInParentProps {
  access_token: string
  rootId: string
  scriptId: string
}
const findFolderInParent = async ({
  access_token,
  rootId,
  scriptId,
}: findFolderInParentProps) => {
  const { data } = await axios.get(
    'https://www.googleapis.com/drive/v3/files',

    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },

      params: {
        q: `'${rootId}' in parents and fullText contains '${scriptId}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
      },
    }
  )

  if (data.files.length < 1) {
    throw new Error('No folder found')
  }
  return data
}

interface downloadAudioFilesInSceneProps {
  rootId: string
  scriptId: string
  sceneId: string
  lines: Line[]
}
//TODO: move to backend
export const downloadAudioFilesInScene = async ({
  rootId,
  scriptId,
  sceneId,
  lines,
}: downloadAudioFilesInSceneProps) => {
  const token = await updateAccessToken()
  const scriptFolder = await findFolderInParent({
    access_token: token,
    rootId,
    scriptId,
  })

  const sceneFolder = await findFolderInParent({
    access_token: token,
    rootId: scriptFolder.files[0].id,
    scriptId: sceneId,
  })

  const folderWithAudio = await findFolderWithAudio({
    access_token: token,
    folderId: sceneFolder.files[0].id,
  })

  const filenames = extractAudioFileNames(folderWithAudio.files)
  if (hasRequiredAudioFiles(lines, filenames)) {
    const audioFileArray = await getGoogleDriveFilesByIds({
      docs: folderWithAudio.files,
    })

    const audioFiles = arrayBufferIntoHTMLAudioElement(audioFileArray)
    return audioFiles
  }
  throw new Error('Missing audio files')
}

interface getGoogleDriveFilesByIdsProps {
  docs: CallbackDoc[]

  responseType?: ResponseType
}
export const getGoogleDriveFilesByIds = async ({
  docs = [],
  responseType = 'arraybuffer',
}: getGoogleDriveFilesByIdsProps) => {
  const token = await updateAccessToken()
  const results = await Promise.all(
    docs.map((doc) =>
      axios.get(`https://www.googleapis.com/drive/v3/files/${doc.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        responseType: responseType,
        params: {
          alt: 'media',
        },
      })
    )
  )

  const dataArray = results.map((result, index) => ({
    id: docs[index].name.replace('.mp3', ''),
    data: result.data,
  }))

  return dataArray
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
  const { data } = await httpClient.post(
    `${BASE_URI}/api/drive/scene-to-speech`,
    {
      id: scriptId,
      scenes: [scene],
      rootFolderId,
    }
  )

  return data
}

/**
 * Creates a root folder for the user if it doesn't exist
 * @returns The id and name of the root folder
 */

export const syncGoogleDrive = async () => {
  const folderName = 'dramatify-pdf-reader' //TODO: pass as param
  const { data } = await httpClient.post(
    `${BASE_URI}/api/drive/create_root_folder`,
    { folderName }
  )

  return data
}
