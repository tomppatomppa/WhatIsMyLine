import { useEffect, useState } from 'react'
import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { Actor, Scene, SceneLine } from '../../reader.types'

import { useReaderContext } from '../../contexts/ReaderContext'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

import { AiOutlineSync } from 'react-icons/ai'
import { labelLines } from '../../utils'

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
import usePlayAudio from '../../hooks/usePlayAudio'
import { PlayIcon } from '../icons'
import { FaCircle, FaMicrophone } from 'react-icons/fa'

const RehearsePanel = () => {
  //TODO: Move to context, or somewhere else
  const user = useCurrentUser()
  const rootFolder = useRootFolder() as RootFolder //Can be moved to useAudio?
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
      onSuccess: () => {
        refetch()
      },
    }
  )

  const uniqueActors = [
    ...new Set(values.data.map((line) => line.name || line.type)),
  ]

  const labeled = labelLines(values, options, audioFiles)
  //TODO: Move to context, or somewhere else
  if (user?.name === 'visitor') {
    return <div className="text-red-900">Not available in visitor mode</div>
  }

  return (
    <div className="flex md:gap-4 sm:mr-12 w-full">
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
        <Message
          show={isSuccess}
          type="success"
          message={`Successfully added audio for ${values.id}`}
        />
        <Message
          show={isError}
          type="error"
          message={`Something went wrong while creating audio for ${values.id}`}
        />
      </Modal>
      <div className="flex flex-1 ">
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
      {audioFiles && !isFetching ? (
        <ComponentWhenValid values={values} labeled={labeled} />
      ) : (
        <button
          type="button"
          className="text-red-900 h-12"
          onClick={() => setShowModal(true)}
        >
          Create
        </button>
      )}
    </div>
  )
}

interface LabeledLine {
  type: SceneLine
  name: string
  id: string
  lines: string
  src: HTMLAudioElement
  shouldPlay: boolean
}

function handleNextAction(labeled: LabeledLine) {
  if (!labeled || !labeled.shouldPlay) return undefined
  return labeled
}
function commandBuilder(
  lines: LabeledLine[],
  action: (nextLine: LabeledLine | undefined) => void
) {
  return lines.map((line, index) => ({
    command: line.lines,
    callback: () => action(handleNextAction(lines[index + 1])),
    isFuzzyMatch: true,
    fuzzyMatchingThreshold: 0.5,
    bestMatchOnly: true,
  }))
}

interface ComponentWhenValidProps {
  values: Scene
  labeled: any[]
}

const ComponentWhenValid = ({ labeled }: ComponentWhenValidProps) => {
  const [start, setStart] = useState(false)

  //TODO: fix bugs || rethink the use of usePlayAudio
  const { audioRef, controls, setCurrentAudio } = usePlayAudio((audio) => {
    const currentIndex = labeled.findIndex((l) => l.src === audio)
    const nextLine = handleNextAction(labeled[currentIndex + 1])
    if (nextLine && currentIndex !== -1) {
      setCurrentAudio(nextLine?.src)
      SpeechRecognition.stopListening()
    } else {
      controls.stopAll()
      SpeechRecognition.startListening({
        language: 'sv-SE',
        continuous: true,
      })
    }
  })

  const commands = commandBuilder(labeled, (nextLine) => {
    if (nextLine) setCurrentAudio(nextLine.src)
  })

  const { listening } = useSpeechRecognition({
    commands,
  })

  const handleStart = () => {
    setStart(true)
    if (labeled[0].shouldPlay) {
      setCurrentAudio(labeled[0].src)
    } else {
      SpeechRecognition.startListening({
        language: 'sv-SE',
        continuous: true,
      })
    }
  }

  const handleStop = () => {
    setStart(false)
    controls.stopAll()
    setCurrentAudio(null)
  }

  useEffect(() => {
    if (!start) return
    return () => {
      controls.stopAll()
      SpeechRecognition.stopListening()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start])

  if (!start) {
    return (
      <button type="button" onClick={handleStart}>
        <PlayIcon />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <button
        className={`${listening ? 'animate-pulse scale-125' : ''}`}
        onClick={() => {
          if (audioRef.current) return
          SpeechRecognition.startListening({
            language: 'sv-SE',
            continuous: true,
          })
        }}
      >
        <FaMicrophone color={`${listening ? 'green' : 'gray'}`} />
      </button>
      <button type="button" onClick={handleStop}>
        <FaCircle color="red" />
      </button>
    </div>
  )
}
export default RehearsePanel
