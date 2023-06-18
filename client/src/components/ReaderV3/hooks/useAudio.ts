import { useState } from 'react'
import { useMutation } from 'react-query'
import { getGoogleDriveFilesByIds } from 'src/API/googleApi'
import { arrayBufferIntoHTMLAudioElement } from '../utils'

const useAudio = () => {
  const [audioFiles, setAudioFiles] = useState<HTMLAudioElement[]>()
  const { mutate: download } = useMutation(getGoogleDriveFilesByIds, {
    onSuccess: (files) => {
      const audioFileArray = arrayBufferIntoHTMLAudioElement(files)
      console.log(audioFileArray)
      setAudioFiles(audioFileArray)
    },
  })
  return { download, audioFiles }
}

export default useAudio
