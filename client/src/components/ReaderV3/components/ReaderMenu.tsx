import { useState } from 'react'
import clsx from 'clsx'
import styles from '../Reader.module.css'
import { MenuPosition } from '../reader.types'
import { SET_MODE, CLOSE_ALL } from '../actions'
import { useReaderContext } from '../contexts/ReaderContext'
import EditIcon from './icons/EditIcon'
import ArrowDown from './icons/ArrowDown'
import ArrowUp from './icons/ArrowUp'
import ReaderMenuButton from './ReaderMenuButton'
import PlayIcon from './icons/PlayIcon'
import ChatIcon from './icons/ChatIcon'
import ReaderSelectActor from './ReaderSelectActor'

const ReaderMenu = () => {
  const { options, dispatch } = useReaderContext()
  const [menuPosition, SetMenuBarPosition] = useState<MenuPosition>('top')

  const isEditing = options.mode === 'edit' ? true : false
  const hasExpandedScenes = options.expanded.length > 0

  const handleSetMenuBarPosition = () => {
    if (menuPosition === 'top') {
      SetMenuBarPosition('bottom')
      return
    }
    SetMenuBarPosition('top')
  }
  console.log(options.highlight)
  return (
    <div id="reader-menu" className={clsx(styles.menu, styles[menuPosition])}>
      <button onClick={handleSetMenuBarPosition}>
        {menuPosition === 'top' ? <ArrowDown /> : <ArrowUp />}
      </button>

      <ReaderMenuButton
        show={hasExpandedScenes}
        text="Close All"
        onClick={() => dispatch(CLOSE_ALL())}
      />
      <p className="flex-1"></p>

      <div id="menu-buttons" className="flex gap-4">
        <ReaderSelectActor actors={options.highlight} />
        <ReaderMenuButton
          onClick={() => console.log('Speak')}
          show={hasExpandedScenes}
          icon={<ChatIcon />}
        />
        <ReaderMenuButton
          onClick={() => console.log('play')}
          show={hasExpandedScenes}
          icon={<PlayIcon />}
        />
        <button onClick={() => dispatch(SET_MODE())}>
          {isEditing ? <>Save</> : <EditIcon />}
        </button>
      </div>
    </div>
  )
}

export default ReaderMenu
