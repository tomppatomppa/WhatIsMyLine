import { useState } from 'react'
import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { Scene } from '../../reader.types'
import AudioPlayer from './AudioPlayer'
import { useReaderContext } from '../../contexts/ReaderContext'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { AiOutlineSync } from 'react-icons/ai'

import { filterAudioFiles } from '../../utils'

import { FaStop } from 'react-icons/fa'

const SceneRehearsalPanel = () => {
  const [start, setStart] = useState(false)
  const { values } = useFormikContext<Scene>()
  const { options } = useReaderContext()
  const { audioFiles, isValid, setSync, sync } = useAudio(values)
  const { transcript, listening, resetTranscript } = useSpeechRecognition({})

  const filteredAudio = filterAudioFiles(values, audioFiles, options)

  return (
    <div className="flex gap-4 mr-12 w-full">
      <button
        onClick={() => setSync(true)}
        className={`${sync ? 'text-gray-400 animate-spin' : ''} `}
      >
        <AiOutlineSync size={24} />
      </button>
      <span className="w-full"></span>
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
      {isValid && !sync ? (
        <button
          onClick={() => {
            setStart(!start)
            SpeechRecognition.stopListening()
          }}
        >
          {start ? <FaStop color="red" /> : 'Rehearse'}
        </button>
      ) : null}
    </div>
  )
}

export default SceneRehearsalPanel
