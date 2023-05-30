// @ts-nocheck
import { useState } from 'react'
import clsx from 'clsx'
import styles from '../Reader.module.css'
import { MenuBarPosition } from '../reader.types'

import { SET_MODE } from '../actions'
import { useReaderContext } from '../contexts/ReaderContext'
import EditIcon from './icons/EditIcon'

const ReaderMenu = () => {
  const { dispatch } = useReaderContext()

  const [menuBarPosition, SetMenuBarPosition] = useState<MenuBarPosition>('top')
  return (
    <div className={clsx(styles.menu, styles[menuBarPosition])}>
      <button
        onClick={() =>
          SetMenuBarPosition(menuBarPosition === 'top' ? 'bottom' : 'top')
        }
      >
        Menu position
      </button>
      <button onClick={() => dispatch(SET_MODE())}>
        <EditIcon />
      </button>
    </div>
  )
}

export default ReaderMenu
