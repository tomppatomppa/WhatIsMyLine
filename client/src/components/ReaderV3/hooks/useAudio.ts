import { useState } from 'react'
import { useQuery } from 'react-query'

import {
  findAudioFileIdsInSceneFolder,
  getGoogleDriveFilesByIds,
} from 'src/API/googleApi'
import { useAccessToken } from 'src/store/userStore'
import {
  hasRequiredAudioFiles,
  arrayBufferIntoHTMLAudioElement,
  extractAudioFileIds,
  Audio,
} from '../utils'

import { Scene } from '../reader.types'

const useAudio = (scene: Scene, scriptId: string, rootId: string) => {
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
      //TODO: typescript
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
