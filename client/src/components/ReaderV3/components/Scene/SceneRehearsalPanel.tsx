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

import Modal from 'src/components/Modal'
import useTextToSpeech from '../../hooks/useTextToSpeech'

const SceneRehearsalPanel = () => {
  const [showModal, setShowModal] = useState(false)
  const [start, setStart] = useState(false)
  const { values } = useFormikContext<Scene>()
  const { options, scriptId } = useReaderContext()
  const { audioFiles, isValid, setIsSyncing, isSyncing } = useAudio(values)
  const { upload } = useTextToSpeech()
  const { transcript, listening, resetTranscript } = useSpeechRecognition({})

  const filteredAudio = filterAudioFiles(values, audioFiles, options)

  return (
    <div className="flex gap-4 mr-12 w-full">
      <Modal
        title="Create audio files for the scene?"
        content="This process will only take a couple
         seconds to send and process the scene text content to audio"
        show={showModal}
        close={() => setShowModal(false)}
        onAccept={() => upload({ scriptId, scene: values })}
      />
      <button
        onClick={() => setIsSyncing(true)}
        className={`${isSyncing ? 'text-gray-400 animate-spin' : ''} `}
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
      {isValid ? (
        <button
          onClick={() => {
            setStart(!start)
            SpeechRecognition.stopListening()
          }}
        >
          {start ? <FaStop color="red" /> : 'Rehearse'}
        </button>
      ) : (
        <button className="text-red-900" onClick={() => setShowModal(true)}>
          Create
        </button>
      )}
    </div>
  )
}

export default SceneRehearsalPanel
