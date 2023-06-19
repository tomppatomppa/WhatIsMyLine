import {
  downloadFolderWithMP3,
  getGoogleDriveFilesByIds,
} from 'src/API/googleApi'

import { useQuery } from 'react-query'
import { useAccessToken } from 'src/store/userStore'
import { useState } from 'react'
import { Scene } from '../reader.types'
import { arrayAttributeMatch, arrayBufferIntoHTMLAudioElement } from '../utils'
import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'

const useAudio = (scene: Scene) => {
  const [audioFiles, setAudioFiles] = useState<HTMLAudioElement[]>()
  const [isValid, setIsValid] = useState(false)
  const [docs, setDocs] = useState<CallbackDoc[]>([])
  const token = useAccessToken()
  const folderId = '1qpJ6O5Biw9JMi74f4Ej7QOPLXgBsiSnq'
  const access_token = token || ''

  const { isError } = useQuery(
    ['scene_audio', access_token],
    () => downloadFolderWithMP3({ access_token, folderId }),
    {
      onSuccess: (data) => {
        if (arrayAttributeMatch(data, scene?.data)) {
          setDocs(data)
          setIsValid(true)
        }
      },
      onError: (err) => {
        console.log(err)
      },
      enabled: !!access_token,
    }
  )

  useQuery(
    ['audio_files'],
    () => getGoogleDriveFilesByIds({ docs, access_token }),
    {
      onSuccess: (result) => {
        const audioFileArray = arrayBufferIntoHTMLAudioElement(result)
        setAudioFiles(audioFileArray)
      },
      onError: (err) => {
        console.log(err)
      },
      enabled: isValid,
    }
  )

  return { isValid, audioFiles, isError }
}

export default useAudio
