import { useState, useEffect } from 'react'
import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { Actor, Line, Scene } from '../../reader.types'

import { useReaderContext } from '../../contexts/ReaderContext'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { AiOutlineSync } from 'react-icons/ai'
import { Audio, filterAudioFiles, filterLines } from '../../utils'
import { FaStop } from 'react-icons/fa'
import Modal from 'src/components/common/Modal'
import { RootFolder, useRootFolder } from 'src/store/scriptStore'
import Spinner from 'src/components/common/Spinner'
import Message from 'src/components/common/Message'
import { useMutation } from 'react-query'
import { createTextToSpeechFromScene } from 'src/API/googleApi'
import AudioPlayer from './AudioPlayer'
import { useCurrentUser } from 'src/store/userStore'

import Dropdown from 'src/components/common/Dropdown'

import Wrapper from 'src/layout/Wrapper'
import SelectList from 'src/components/SelectList'
import AudioPlayerAlt from 'src/components/common/AudioPlayerAlt'
import { getUser } from 'src/API/loginApi'

function commandBuilder(
  lines: Line[],
  action: (lineIndex: number, command: string, stopListening: any) => void
) {
  return lines.map((line, index) => ({
    command: line.lines,
    callback: (
      command: any,
      spokenPhrase: any,
      similarityRatio: number,
      stopListening: any
    ) => action(index, command, stopListening),
    isFuzzyMatch: true,
    fuzzyMatchingThreshold: 0.5,
    bestMatchOnly: true,
  }))
}

const RehearsePanel = () => {
  const user = useCurrentUser()
  const rootFolder = useRootFolder() as RootFolder
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [startRehearse, setStartRehearse] = useState(false)
  const { values } = useFormikContext<Scene>()
  const { options, scriptId, dispatch } = useReaderContext()
  const { audioFiles, isValid, setIsSyncing, isSyncing } = useAudio(
    values,
    scriptId,
    rootFolder?.id
  )
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(
    null
  )

  const filteredLines = filterLines(values, options)

  const uniqueActors = [
    ...new Set(values.data.map((line) => line.name || line.type)),
  ]
  const { mutate: getUserData } = useMutation(getUser, {
    onSuccess: (data) => {
      console.log(data)
    },
  })
  const commands = commandBuilder(
    values.data,
    (lineIndex, command, stopListening) => {
      if (!values.data[lineIndex + 1] || !audioFiles) {
        setStartRehearse(false)
        return
      }
      const nextLine = values.data[lineIndex + 1]

      if (filteredLines.some((line) => line.lines === nextLine.lines)) {
        setCurrentAudioIndex(() =>
          audioFiles.findIndex((audio) => (audio as Audio).key === nextLine.id)
        )
      }
    }
  )

  const { listening, resetTranscript } = useSpeechRecognition({
    commands,
  })

  // const filteredAudio = filterAudioFiles(values, audioFiles, options)

  const { mutate, isError, isLoading } = useMutation(
    createTextToSpeechFromScene,
    {
      onSuccess: (data) => {
        setMessage(`Successfully added audio for ${data.name}`)
        //Toggle query for downloading files
        setIsSyncing(true)
      },
      onError: () => {
        setMessage('Something went wrong')
      },
    }
  )

  useEffect(() => {
    if (startRehearse) {
      SpeechRecognition.startListening({
        language: 'sv-SE',
        continuous: true,
      })
      setCurrentAudioIndex(0)
    }
    return () => {
      SpeechRecognition.stopListening()
    }
  }, [startRehearse])

  if (user?.name === 'visitor') {
    return <div className="text-red-900">Not available in visitor mode</div>
  }

  return (
    <div className="flex gap-4 mr-12 w-full flex-col sm:flex-row">
      <Modal
        title="Create audio files for the scene?"
        content="This process will only take a couple
         seconds"
        show={showModal}
        close={() => setShowModal(false)}
        onAccept={() =>
          mutate({
            scriptId,
            scene: values,
            rootFolderId: rootFolder.id,
          })
        }
      >
        <Spinner show={isLoading} />
        <Message type={isError ? 'alert' : 'success'} message={message} />
      </Modal>
      <button
        onClick={() => setIsSyncing(true)}
        className={`${isSyncing ? 'text-gray-400 animate-spin' : ''} `}
      >
        <AiOutlineSync size={24} />
      </button>
      <span className="w-full"></span>
      <Dropdown title="Actors">
        <Wrapper>
          <SelectList
            labels={uniqueActors.map((actor) => ({
              label: actor,
              value: actor === 'INFO' ? '' : actor,
            }))}
            initialValues={options.highlight.map(
              (actor: Actor) => actor.id || ''
            )}
            onCheck={(label) =>
              dispatch({
                type: 'HIGHLIGHT_TARGET',
                payload: { target: label },
              })
            }
          />
        </Wrapper>
      </Dropdown>
      {audioFiles && currentAudioIndex !== null ? (
        <AudioPlayerAlt
          active={startRehearse}
          setListen={() => {
            SpeechRecognition.startListening({
              language: 'sv-SE',
              continuous: true,
            })
            setCurrentAudioIndex(null)
          }}
          stopListen={() => {
            SpeechRecognition.stopListening()
            resetTranscript()
          }}
          files={audioFiles[currentAudioIndex]}
          transcript={undefined}
          listening={listening}
        />
      ) : null}
      <button onClick={() => getUserData()}>sdsd</button>
      {/* {startRehearse ? (
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
      ) : null} */}
      {isValid ? (
        <button
          type="button"
          onClick={() => {
            if (listening) {
              setStartRehearse(false)
              SpeechRecognition.stopListening()
              resetTranscript()
            } else {
              setStartRehearse(true)
            }
          }}
        >
          {startRehearse ? <FaStop color="red" /> : 'Rehearse'}
        </button>
      ) : (
        <button
          type="button"
          disabled={isSyncing}
          className="text-red-900"
          onClick={() => setShowModal(true)}
        >
          Create
        </button>
      )}
    </div>
  )
}

export default RehearsePanel
