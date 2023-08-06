import { useState, useEffect } from 'react'
import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { Actor, Line, Scene } from '../../reader.types'

import { useReaderContext } from '../../contexts/ReaderContext'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

import { AiOutlineSync } from 'react-icons/ai'
import { labelLines } from '../../utils'
import { FaStop } from 'react-icons/fa'
import Modal from 'src/components/common/Modal'
import { RootFolder, useRootFolder } from 'src/store/scriptStore'
import Spinner from 'src/components/common/Spinner'
import Message from 'src/components/common/Message'
import { useMutation } from 'react-query'
import { createTextToSpeechFromScene } from 'src/API/googleApi'
import { useCurrentUser } from 'src/store/userStore'

import Dropdown from 'src/components/common/Dropdown'

import Wrapper from 'src/layout/Wrapper'
import SelectList from 'src/components/SelectList'
import AudioPlayerAlt from 'src/components/common/AudioPlayerAlt'
import { ChatIcon } from '../icons'

function commandBuilder(lines: Line[], action: (lineIndex: number) => void) {
  return lines.map((line, index) => ({
    command: line.lines,
    callback: () => action(index),
    isFuzzyMatch: true,
    fuzzyMatchingThreshold: 0.5,
    bestMatchOnly: true,
  }))
}

const RehearsePanel = () => {
  //TODO: Move to context, or somewhere else
  const user = useCurrentUser()
  const rootFolder = useRootFolder() as RootFolder //Can be moved to useAudio?
  const [message, setMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { values } = useFormikContext<Scene>()
  const { options, scriptId, dispatch } = useReaderContext()
  const { audioFiles, refetch, isFetching } = useAudio(
    values,
    scriptId,
    rootFolder?.id
  )
  const { mutate, isError, isSuccess, isLoading } = useMutation(
    createTextToSpeechFromScene,
    {
      onSuccess: (data) => {
        setMessage(`Successfully added audio for ${data.name}`)
        //Toggle query for downloading files
        refetch()
      },
      onError: () => {
        setMessage('Something went wrong')
      },
    }
  )

  // const [index, setIndex] = useState(0)
  // const [startRehearse, setStartRehearse] = useState(false)
  // const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
  //   null
  // )

  // const labeled = labelLines(values, options, audioFiles)
  // const uniqueActors = [
  //   ...new Set(values.data.map((line) => line.name || line.type)),
  // ]

  // const commands = commandBuilder(values.data, (lineIndex) => {
  //   const nextLine = labeled[lineIndex + 1]
  //   if (nextLine && nextLine.shouldPlay) {
  //     setCurrentAudio(() => nextLine.src as HTMLAudioElement)
  //   }
  // })

  // useSpeechRecognition({
  //   commands,
  // })

  // const setNextLine = () => {
  //   const nextLine = labeled[index + 1]

  //   if (nextLine && nextLine.shouldPlay) {
  //     setCurrentAudio(() => nextLine.src as HTMLAudioElement) //TODO: Does not trigger next audio
  //     setIndex((prev) => prev + 1)
  //   }
  // }

  // const reset = () => {
  //   setIndex(0)
  //   setCurrentAudio(null)
  //   setStartRehearse(false)
  // }

  // useEffect(() => {
  //   if (labeled[0] && labeled[0].shouldPlay && labeled[0].src) {
  //     setCurrentAudio(labeled[0].src)
  //   }

  //   if (startRehearse) {
  //     SpeechRecognition.startListening({
  //       language: 'sv-SE',
  //       continuous: true,
  //     })
  //   }

  //   return () => {
  //     SpeechRecognition.stopListening()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [startRehearse])

  //TODO: Move to context, or somewhere else
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
      <div className="flex flex-1">
        <button
          onClick={() => refetch()}
          className={`${isFetching ? 'text-gray-400 animate-spin' : ''} `}
        >
          <AiOutlineSync size={24} />
        </button>
      </div>
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
      {audioFiles ? (
        <ComponentWhenValid audioFiles={audioFiles} />
      ) : (
        <button
          type="button"
          className="text-red-900 h-12"
          onClick={() => setShowModal(true)}
        >
          Create
        </button>
      )}
      {/* <AudioPlayerAlt
        active={startRehearse}
        setListen={() => {
          setNextLine()
          SpeechRecognition.startListening({
            language: 'sv-SE',
            continuous: true,
          })
        }}
        stopListen={() => {
          SpeechRecognition.stopListening()
        }}
        files={currentAudio}
        transcript={undefined}
      /> */}
      {/* {startRehearse ? (
        <button onClick={() => reset()}>
          <FaStop color="red" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setStartRehearse(() => true)
          }}
        >
          <ChatIcon />
        </button>
      )} */}
    </div>
  )
}

interface ComponentWhenValidProps {
  audioFiles: HTMLAudioElement[]
}
const ComponentWhenValid = ({ audioFiles }: ComponentWhenValidProps) => {
  console.log(audioFiles)
  return <div className="flex items-center">Valid</div>
}
export default RehearsePanel
