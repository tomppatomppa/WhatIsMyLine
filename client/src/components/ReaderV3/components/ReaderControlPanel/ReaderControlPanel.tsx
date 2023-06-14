import { useState } from 'react'
import { useReaderContext } from '../../contexts/ReaderContext'
import { MinimizeButton } from './MinimizeButton'
import { ControlPanelButton } from './ControlPanelButton'
import { ChatIcon, ConfirmIcon, DeleteIcon, PlayIcon } from '../icons'

const ReaderControlPanel = () => {
  const { options, dispatch } = useReaderContext()
  const [minimized, setMinimized] = useState(false)

  const hasExpandedScenes = options.expanded.length
  const isReading = options.mode === 'read'

  return (
    <div
      className={`z-50 flex sticky mt-2 w-48 mx-auto justify-center rounded-md bg-indigo-200 shadow-md`}
    >
      <div id="reader-controlpanel">
        <span className="flex-1" />
        <MinimizeButton onClick={() => setMinimized(!minimized)} />
        {!minimized && (
          <div id="button-container" className="flex gap-2 w-full px-2">
            <ControlPanelButton icon={<ConfirmIcon />}>
              <button
                className={!hasExpandedScenes ? 'text-neutral-600' : ''}
                disabled={!hasExpandedScenes}
                onClick={() =>
                  dispatch({
                    type: 'CLOSE_ALL',
                  })
                }
              >
                Close All
              </button>
            </ControlPanelButton>
            <ControlPanelButton
              onClick={() => console.log('play')}
              icon={<PlayIcon />}
            />
            <ControlPanelButton
              onClick={() =>
                dispatch({
                  type: 'SET_MODE',
                  payload: { setMode: isReading ? 'idle' : 'read' },
                })
              }
              icon={isReading ? <DeleteIcon /> : <ChatIcon />}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReaderControlPanel
