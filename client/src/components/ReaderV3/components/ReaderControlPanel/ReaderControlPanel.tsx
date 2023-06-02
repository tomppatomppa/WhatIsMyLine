import clsx from 'clsx'
import { useState } from 'react'
import { useReaderContext } from '../../contexts/ReaderContext'
import { MinimizeButton } from './MinimizeButton'
import { ControlPanelButton } from './ControlPanelButton'
import { ChatIcon, ConfirmIcon, PlayIcon } from '../icons'

const ReaderControlPanel = () => {
  const { options, dispatch } = useReaderContext()
  const [minimized, setMinimized] = useState(false)
  const hasExpandedScenes = options.expanded.length

  return (
    <div
      id="reader-controlpanel"
      className={clsx(
        `z-50 flex sticky top-2 md:w-1/2 ${
          minimized ? 'h-2' : ''
        } left-1/2  md:-translate-x-1/2 px-4 rounded-md
         bg-indigo-200 shadow-lg text-white`
      )}
    >
      <span className="flex-1" />
      <MinimizeButton onClick={() => setMinimized(!minimized)} />
      {!minimized && (
        <div id="button-container" className="flex gap-2">
          <ControlPanelButton icon={<ConfirmIcon />}>
            <button
              className={clsx(!hasExpandedScenes && 'text-neutral-600')}
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
            onClick={() => console.log('speak')}
            icon={<ChatIcon />}
          />
        </div>
      )}
    </div>
  )
}

export default ReaderControlPanel
