import { useQuery } from 'react-query'

import { Scene } from '../reader.types'
import { downloadSceneAudio } from '../../../API/googleApi'
import { CustomHTMLAudioElement } from '../../../utils/helpers'

const useAudio = (scene: Scene, scriptId: string, rootId: string) => {
  const { data, isError, isLoading, refetch, isFetching } = useQuery(
    [`scene-${scene.id}-audio`],
    () =>
      downloadSceneAudio({
        rootId,
        scriptId,
        sceneId: scene.id,
        lines: scene.data,
      }),
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
      retry: false,
      enabled: !!rootId,
    }
  )

  return {
    audioFiles: data as CustomHTMLAudioElement[],
    isError,
    isLoading,
    refetch,
    isFetching,
  }
}

export default useAudio
