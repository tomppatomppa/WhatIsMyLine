import axios, { ResponseType } from 'axios'
import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'
import { Scene } from 'src/components/ReaderV3/reader.types'
import { BASE_URI } from 'src/config'
import { httpClient } from 'src/utils/axiosClient'

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

interface FindAudioFileIdsInSceneFolderProps {
  rootId: string
  access_token: string
  scriptId: string
  sceneId: string
}
export const findAudioFileIdsInSceneFolder = async ({
  rootId,
  access_token,
  scriptId,
  sceneId,
}: FindAudioFileIdsInSceneFolderProps) => {
  const scriptFolder = await findFolderInParent({
    access_token,
    rootId,
    scriptId,
  })

  const sceneFolder = await findFolderInParent({
    access_token,
    rootId: scriptFolder.files[0].id,
    scriptId: sceneId,
  })

  const folderWithAudio = await findFolderWithAudio({
    access_token,
    folderId: sceneFolder.files[0].id,
  })

  return folderWithAudio.files
}

interface getGoogleDriveFilesByIdsProps {
  docs: CallbackDoc[]
  access_token: string | undefined
  responseType?: ResponseType
}
export const getGoogleDriveFilesByIds = async ({
  docs = [],
  access_token,
  responseType = 'arraybuffer',
}: getGoogleDriveFilesByIdsProps) => {
  const results = await Promise.all(
    docs.map((doc) =>
      axios.get(`https://www.googleapis.com/drive/v3/files/${doc.id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
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
export const createTextToSpeechFromScene = async ({
  scriptId,
  scene,
  rootFolderId,
}: CreateTextToSpeechSceneProps) => {
  const { data } = await httpClient.post(`${BASE_URI}/api/v3/scene-to-speech`, {
    id: scriptId,
    scenes: [scene],
    rootFolderId,
  })

  return data
}

export const syncGoogleDrive = async () => {
  const { data } = await httpClient.post(`${BASE_URI}/create_root_folder`)

  return data
}
