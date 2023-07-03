import { downloadFiles } from 'src/API/googleApi'

import { useQuery } from 'react-query'
import { useAccessToken, useLogout } from 'src/store/userStore'
import { useState } from 'react'
import { Scene } from '../reader.types'
import {
  hasRequiredAudioFiles,
  arrayBufferIntoHTMLAudioElement,
} from '../utils'

const useAudio = (scene: Scene) => {
  const logout = useLogout()
  const [isSyncing, setIsSyncing] = useState(true)
  const [audioFiles, setAudioFiles] = useState<HTMLAudioElement[]>()
  const [isValid, setIsValid] = useState(false)
  const access_token = useAccessToken()

  const { isError, isLoading } = useQuery(
    ['scene_audio', access_token],
    () => downloadFiles(access_token as string, scene.id),
    {
      onSuccess: (googleDriveFileArray) => {
        if (hasRequiredAudioFiles(scene.data, googleDriveFileArray)) {
          const audioFileArray =
            arrayBufferIntoHTMLAudioElement(googleDriveFileArray)
          setIsValid(true)
          setAudioFiles(audioFileArray)
        }
      },
      onError: (error) => {
        const { response } = error as any
        if (response?.data?.error.status === 'UNAUTHENTICATED') {
          logout()
        }
      },
      onSettled: () => {
        setIsSyncing(false)
      },
      enabled: isSyncing,
    }
  )

  return { isValid, audioFiles, isError, isLoading, setIsSyncing, isSyncing }
}

export default useAudio
