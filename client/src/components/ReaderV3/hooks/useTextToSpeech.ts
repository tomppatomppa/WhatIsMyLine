import { useMutation } from 'react-query'
import { createTextToSpeechFromScene } from 'src/API/googleApi'

const useTextToSpeech = () => {
  const { mutate: upload } = useMutation(createTextToSpeechFromScene, {
    onSuccess: (data) => {
      console.log(data)
    },
  })
  return { upload }
}

export default useTextToSpeech
