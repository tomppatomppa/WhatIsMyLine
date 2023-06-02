import clsx from 'clsx'
import styles from '../Reader.module.css'
import { useReaderContext } from '../contexts/ReaderContext'
import ReaderMenuButton from './ReaderMenuButton'
import ConfirmIcon from './icons/ConfirmIcon'
import useComponentVisible from 'src/hooks/useComponentVisible'
import { useState } from 'react'

const ReaderMenu = () => {
  const { options, dispatch } = useReaderContext()
  const [minimized, setMinimized] = useState(false)
  const hasExpandedScenes = options.expanded.length

  return (
    <div
      id="reader-menu"
      className={clsx(
        `z-50 fixed top-16 w-1/2 ${
          minimized ? 'h-2' : ''
        } left-1/2 -translate-x-1/2 pr-4 gap-4 rounded-md flex flex-row bg-indigo-200 shadow-lg text-white`
      )}
    >
      <span className="flex-1" />
      <MinimizeButton onClick={() => setMinimized(!minimized)} />
      {!minimized && (
        <div id="button-container" className="flex">
          <MenuBarIcon icon={<ConfirmIcon />}>
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
            <ReaderMenuButton
              className="text-white"
              onClick={() => console.log('Speak')}
              show
              text="Speak"
            />
            <ReaderMenuButton
              className="text-white"
              onClick={() => console.log('play')}
              show
              text="Play"
            />
          </MenuBarIcon>
          <MenuBarIcon icon={<ConfirmIcon />}>
            <button>Action</button>
            <button>Action</button>
            <button>Action</button>
          </MenuBarIcon>
        </div>
      )}
    </div>
  )
}

export default ReaderMenu

interface MinimizeButtonProps {
  onClick: () => void
}
const MinimizeButton = (props: MinimizeButtonProps) => {
  return (
    <span
      onClick={props.onClick}
      className={`hover:scale-100 scale-50 absolute -right-2 -top-2 w-6 h-6 bg-indigo-400 hover:bg-indigo-500 rounded-full translate-all duration-200`}
    />
  )
}
const MenuBarIcon = ({ icon, children }: any) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onClick={() => setIsComponentVisible(true)}
      className={clsx(
        styles['menubar'],
        'menubar-icon transition-all duration-200'
      )}
    >
      {icon}
      {children && (
        <span
          className={clsx(
            styles['tooltip'],
            `transition-all duration-200 ${
              isComponentVisible ? 'scale-100' : 'scale-0'
            }`
          )}
        >
          <div className="flex flex-col items-start gap-y-2">{children}</div>
        </span>
      )}
    </div>
  )
}
