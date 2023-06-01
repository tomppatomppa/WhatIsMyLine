import clsx from 'clsx'
import styles from '../Reader.module.css'
import { useReaderContext } from '../contexts/ReaderContext'
import ReaderMenuButton from './ReaderMenuButton'
import ConfirmIcon from './icons/ConfirmIcon'
import useComponentVisible from 'src/hooks/useComponentVisible'
import { UseComponentVisibleResult } from 'src/hooks/useComponentVisible'
const ReaderMenu = () => {
  const { options, dispatch } = useReaderContext()

  const hasExpandedScenes = options.expanded.length > 0

  return (
    <div id="reader-menu" className={clsx(styles.menu)}>
      <div className="fixed top-24 pr-4 left-1/2  -translate-x-1/2  gap-4  rounded-md flex flex-row bg-gray-900 shadow-lg text-white">
        <span className="flex-1" />
        <TopBarIcon icon={<ConfirmIcon />}>
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
        </TopBarIcon>
        <TopBarIcon icon={<ConfirmIcon />}>
          <button>Action</button>
          <button>Action</button>
          <button>Action</button>
        </TopBarIcon>
      </div>
    </div>
  )
}

export default ReaderMenu

const TopBarIcon = ({ icon, children }: any) => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false)

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      onClick={() => setIsComponentVisible(true)}
      className={clsx(
        styles['sidebar'],
        'sidebar-icon transition-all duration-200'
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
