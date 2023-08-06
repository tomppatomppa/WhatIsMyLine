import { useState } from 'react'
import { useQuery } from 'react-query'

import {
  findAudioFileIdsInSceneFolder,
  getGoogleDriveFilesByIds,
} from 'src/API/googleApi'

import {
  hasRequiredAudioFiles,
  arrayBufferIntoHTMLAudioElement,
  extractAudioFileIds,
  Audio,
} from '../utils'

import { Scene } from '../reader.types'

const useAudio = (scene: Scene, scriptId: string, rootId: string) => {
  const [audioFiles, setAudioFiles] = useState<HTMLAudioElement[]>()

  const { isError, isLoading, refetch, isFetching } = useQuery(
    ['scene_audio'],
    () =>
      findAudioFileIdsInSceneFolder({
        rootId,
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
          })

          const audioFiles = arrayBufferIntoHTMLAudioElement(audioFileArray)
          setAudioFiles(audioFiles as Audio[])
        }
      },
      retry: false,
    }
  )

  return {
    audioFiles,
    isError,
    isLoading,
    refetch,
    isFetching,
  }
}

export default useAudio
