import useVerifyAudio from '../../hooks/useVerifyAudio'
import useAudio from '../../hooks/useAudio'
import { useFormikContext } from 'formik'
import { useAccessToken } from 'src/store/userStore'
import { Line, Scene } from '../../reader.types'
import AudioPlayer from './AudioPlayer'

import { useReaderContext } from '../../contexts/ReaderContext'

interface Audio extends HTMLAudioElement {
  key: string
}
const SceneRehearsalPanel = () => {
  const access_token = useAccessToken()
  const { options } = useReaderContext()
  const { values } = useFormikContext<Scene>()
  const { isValid, data } = useVerifyAudio(values as Scene)
  const { download, audioFiles } = useAudio()

  const filteredLines = values.data.filter(
    ({ name }) =>
      !options.highlight.some((highlight: Line) => highlight.id === name)
  )
  const filteredAudio = filteredLines.map((line) => {
    const audio = audioFiles?.find(
      (item) => (item as Audio).key === line.id
    ) as Audio
    return audio
  })

  return isValid ? (
    <div className="flex gap-4 mr-12  justify-start">
      {audioFiles ? (
        <div className="flex flex-row justify-start">
          <AudioPlayer files={filteredAudio} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            if (access_token) {
              download({
                docs: data,
                access_token,
              })
            }
          }}
        >
          Download Audio
        </button>
      )}
    </div>
  ) : null
}

export default SceneRehearsalPanel
