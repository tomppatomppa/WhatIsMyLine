import { useState, useEffect, useRef, MutableRefObject } from 'react'
import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { Actor, Line, Scene, SceneLine } from '../../reader.types'
import useSound from 'use-sound'
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
import { AudioButton } from 'src/components/common/AudioButton'
import usePlayAudio from '../../hooks/usePlayAudio'

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

  //Add audio to lines
  const labeled = labelLines(values, options, audioFiles)
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
        <Message
          type={isError ? 'alert' : 'success'}
          message={isSuccess ? `Successfully added audio for ${scriptId}` : ``}
        />
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

function commandBuilder(
  lines: LabeledLine[],
  action: (line: LabeledLine, nextLine: LabeledLine | undefined) => void
) {
  function handleNextAction(labeled: LabeledLine) {
    if (!labeled || !labeled.shouldPlay) return undefined

    return labeled
  }

  return lines.map((line, index) => ({
    command: line.lines,
    callback: () => action(line, handleNextAction(lines[index + 1])),
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
  const { controls, setCurrentAudio } = usePlayAudio()

  const commands = commandBuilder(labeled, (line, nextLine) => {
    if (nextLine) setCurrentAudio(nextLine.src)
  })

  useSpeechRecognition({
    commands,
  })

  const handleStart = () => {
    setStart(true)
    SpeechRecognition.startListening({
      language: 'sv-SE',
      continuous: true,
    })
  }

  const handleStop = () => {
    setStart(false)
    controls.reset()
    setCurrentAudio(null)
    SpeechRecognition.stopListening()
  }

  if (!start) {
    return (
      <button type="button" onClick={handleStart}>
        Play
      </button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      {/*Controls */}
      <div className="bg-gray-200 flex gap-4 border p-2">
        <AudioButton text="Play" onClick={() => controls.play()} />
        <AudioButton text="Reset" onClick={() => controls.reset()} />
        <AudioButton text="Pause" onClick={() => controls.pause()} />
        <AudioButton
          text="Load"
          onClick={() => setCurrentAudio(labeled[0].src)}
        />
      </div>

      <button type="button" onClick={handleStop}>
        Stop
      </button>
    </div>
  )
}
export default RehearsePanel
