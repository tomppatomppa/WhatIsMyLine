import { useState } from 'react'
import { useReaderContext } from '../../contexts/ReaderContext'
import { MinimizeButton } from './MinimizeButton'
import { ControlPanelButton } from './ControlPanelButton'
import { ChatIcon, ConfirmIcon, PlayIcon } from '../icons'
import styles from '../../Reader.module.css'

const ReaderControlPanel = () => {
  const { options, dispatch } = useReaderContext()
  const [minimized, setMinimized] = useState(false)
  const hasExpandedScenes = options.expanded.length
  const minimizedStyle = minimized ? 'minimized' : ''

  return (
    <div className={(styles['controlpanel'], styles[minimizedStyle])}>
      <div id="reader-controlpanel">
        <span className="flex-1" />
        <MinimizeButton onClick={() => setMinimized(!minimized)} />
        {!minimized && (
          <div id="button-container" className="flex gap-2">
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
              onClick={() => console.log('speak')}
              icon={<ChatIcon />}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ReaderControlPanel
