import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { Line, Scene } from '../../reader.types'
import AudioPlayer from './AudioPlayer'
import { useReaderContext } from '../../contexts/ReaderContext'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

import { useState } from 'react'

interface Audio extends HTMLAudioElement {
  key: string
}

const SceneRehearsalPanel = () => {
  const [start, setStart] = useState(false)
  const { options } = useReaderContext()
  const { values } = useFormikContext<Scene>()
  const { audioFiles, isError, isValid } = useAudio(values)
  const { transcript, listening } = useSpeechRecognition({})

  const filteredLines: Line[] = values.data.filter(
    ({ name }) =>
      !options.highlight.some((highlight: Line) => highlight.id === name)
  )

  const filteredAudio = filteredLines.map((line) => {
    const audio = audioFiles?.find(
      (item) => (item as Audio).key === line.id
    ) as Audio
    return audio
  })

  if (isError || !isValid) {
    return <div>Something went wrong</div>
  }

  return (
    <div className="flex gap-4 mr-12 justify-start">
      {start ? (
        <div className="flex flex-row gap-6 justify-start items-center">
          <AudioPlayer
            files={filteredAudio}
            listening={listening}
            transcript={transcript}
            setListen={() =>
              SpeechRecognition.startListening({
                language: 'sv-SE',
                continuous: true,
              })
            }
            stopListen={SpeechRecognition.stopListening}
          />
        </div>
      ) : null}
      <button
        onClick={() => {
          setStart(!start)
          SpeechRecognition.stopListening()
        }}
      >
        {start ? 'stop' : 'start'}
      </button>
    </div>
  )
}

export default SceneRehearsalPanel
