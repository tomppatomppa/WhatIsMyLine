import { downloadFolderWithMP3 } from 'src/API/googleApi'

import { useQuery } from 'react-query'
import { useAccessToken } from 'src/store/userStore'
import { useEffect, useState } from 'react'
import { Scene } from '../reader.types'
import { arrayAttributeMatch } from '../utils'

const useVerifyAudio = (scene: Scene) => {
  const [verify, setVerify] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const token = useAccessToken()
  const folderId = '1qpJ6O5Biw9JMi74f4Ej7QOPLXgBsiSnq'
  const access_token = token || ''

  const { data } = useQuery(
    ['scene_audio', access_token],
    () => downloadFolderWithMP3({ access_token, folderId }),
    {
      onSuccess: (data) => {
        if (arrayAttributeMatch(data, scene?.data)) {
          setIsValid(true)
        }
      },
      onSettled: () => {
        setVerify(false)
      },
      enabled: !!access_token && !!verify,
    }
  )
  useEffect(() => {
    if (arrayAttributeMatch(data, scene?.data)) {
      setIsValid(true)
    }
  }, [data, scene?.data])

  return { setVerify, isValid, data }
}

export default useVerifyAudio
