import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { Scene } from '../../reader.types'
import AudioPlayer from './AudioPlayer'
import { useReaderContext } from '../../contexts/ReaderContext'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

import { useState } from 'react'
import { filterAudioFiles } from '../../utils'

const SceneRehearsalPanel = () => {
  const [start, setStart] = useState(false)
  const { values } = useFormikContext<Scene>()
  const { options } = useReaderContext()
  const { audioFiles, isValid } = useAudio(values)
  const { transcript, listening, resetTranscript } = useSpeechRecognition({})

  const filteredAudio = filterAudioFiles(values, audioFiles, options)

  if (!isValid) {
    return <div>Download</div>
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
            stopListen={() => {
              SpeechRecognition.stopListening()
              resetTranscript()
            }}
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
