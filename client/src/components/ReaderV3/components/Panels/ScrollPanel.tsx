import { useFormikContext } from 'formik'
import { Scene } from '../../reader.types'
import { useEffect } from 'react'
import { useReaderContext } from '../../contexts/ReaderContext'
import { ScrollCommandBuilder } from '../commands/ScrollPanelCommand'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'

const ScrollPanel = () => {
  const { values } = useFormikContext<Scene>()
  const { dispatch } = useReaderContext()

  const handleSetCurrentScrollTarget = (currentScrollTarget: string) => {
    dispatch({
      type: 'SET_CURRENT_SCROLL_TARGET',
      payload: { currentScrollTarget },
    })
  }

  useEffect(() => {
    return () => {
      dispatch({ type: 'SET_CURRENT_SCROLL_TARGET', payload: '' })
    }
  }, [dispatch])

  const commands = ScrollCommandBuilder(values.data, (currentScrollTarget) => {
    if (currentScrollTarget) {
      dispatch({
        type: 'SET_CURRENT_SCROLL_TARGET',
        payload: { currentScrollTarget },
      })
    }
  })

  const { listening } = useSpeechRecognition({
    commands,
  })

  SpeechRecognition.startListening({
    language: 'sv-SE',
    continuous: true,
  })

  return (
    <div>
      {listening ? 'listening' : 'not listening'}
      <select onChange={(e) => handleSetCurrentScrollTarget(e.target.value)}>
        {values.data.map((line) => (
          <option>{line.id}</option>
        ))}
      </select>
    </div>
  )
}

export default ScrollPanel
