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
import Spinner from 'src/components/common/Spinner'

const SceneRehearsalPanel = () => {
  const [start, setStart] = useState(false)
  const { values } = useFormikContext<Scene>()
  const { options } = useReaderContext()
  const { audioFiles, isLoading, isValid } = useAudio(values)
  const { transcript, listening, resetTranscript } = useSpeechRecognition({})

  const filteredAudio = filterAudioFiles(values, audioFiles, options)

  return (
    <div className="flex gap-4 mr-12 justify-start">
      <Spinner show={isLoading} />
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
        disabled={!isValid}
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
