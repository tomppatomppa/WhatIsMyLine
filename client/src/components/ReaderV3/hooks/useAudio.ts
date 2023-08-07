import { useQuery } from 'react-query'

import { downloadAudioFilesInScene } from 'src/API/googleApi'
import { Audio } from '../utils'
import { Scene } from '../reader.types'

const useAudio = (scene: Scene, scriptId: string, rootId: string) => {
  const { data, isError, isLoading, refetch, isFetching } = useQuery(
    [`scene-${scene.id}-audio`],
    () =>
      downloadAudioFilesInScene({
        rootId,
        scriptId,
        sceneId: scene.id,
        lines: scene.data,
      }),
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
      retry: false,
    }
  )

  return {
    audioFiles: data as Audio[],
    isError,
    isLoading,
    refetch,
    isFetching,
  }
}

export default useAudio
