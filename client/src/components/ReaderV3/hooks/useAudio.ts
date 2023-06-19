import { downloadFiles } from 'src/API/googleApi'

import { useQuery } from 'react-query'
import { useAccessToken } from 'src/store/userStore'
import { useState } from 'react'
import { Scene } from '../reader.types'
import { arrayAttributeMatch, arrayBufferIntoHTMLAudioElement } from '../utils'

const useAudio = (scene: Scene) => {
  const [sync, setSync] = useState(true)
  const [audioFiles, setAudioFiles] = useState<HTMLAudioElement[]>()
  const [isValid, setIsValid] = useState(false)
  const access_token = useAccessToken()

  const { isError, isLoading } = useQuery(
    ['scene_audio', access_token],
    () => downloadFiles(access_token as string, scene.id),
    {
      onSuccess: (data) => {
        if (arrayAttributeMatch(scene.data, data)) {
          const audioFileArray = arrayBufferIntoHTMLAudioElement(data)
          setIsValid(true)
          setAudioFiles(audioFileArray)
        }
      },
      onSettled: () => {
        setSync(false)
      },
      enabled: sync,
    }
  )

  return { isValid, audioFiles, isError, isLoading, setSync, sync }
}

export default useAudio
