import {
  findAudioFileIdsInSceneFolder,
  getGoogleDriveFilesByIds,
} from 'src/API/googleApi'

import { useQuery } from 'react-query'
import { useAccessToken, useLogout } from 'src/store/userStore'
import { useState } from 'react'
import { Scene } from '../reader.types'
import {
  hasRequiredAudioFiles,
  arrayBufferIntoHTMLAudioElement,
  extractAudioFileIds,
  Audio,
} from '../utils'

const useAudio = (scene: Scene, scriptId: string, rootId: string) => {
  const logout = useLogout()
  const [isSyncing, setIsSyncing] = useState(true)
  const [audioFiles, setAudioFiles] = useState<HTMLAudioElement[]>()
  const [isValid, setIsValid] = useState(false)
  const access_token = useAccessToken() as string

  const { isError, isLoading } = useQuery(
    ['scene_audio', access_token],
    () =>
      findAudioFileIdsInSceneFolder({
        rootId,
        access_token,
        scriptId,
        sceneId: scene.id,
      }),
    {
      onSuccess: async (data) => {
        const driveFolderIds = extractAudioFileIds(data)
        if (hasRequiredAudioFiles(scene.data, driveFolderIds)) {
          const audioFileArray = await getGoogleDriveFilesByIds({
            docs: data,
            access_token,
          })
          const audioFiles = arrayBufferIntoHTMLAudioElement(audioFileArray)
          setIsValid(true)
          setAudioFiles(audioFiles as Audio[])
        }
      },
      onError: (error: any) => {
        if (error?.response?.data?.error.status === 'UNAUTHENTICATED') {
          logout()
        }
        console.log(error)
      },
      onSettled: () => {
        setIsSyncing(false)
      },
      enabled: isSyncing,
      retry: false,
    }
  )
  return { isValid, audioFiles, isError, isLoading, setIsSyncing, isSyncing }
}

export default useAudio
