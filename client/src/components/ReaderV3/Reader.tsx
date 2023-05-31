import { useReducer } from 'react'
import clsx from 'clsx'
import reducer from './reducer'
import ReaderContext from './contexts/ReaderContext'

import styles from './Reader.module.css'
import { OptionState } from './reader.types'

interface ReaderProps {
  children?: React.ReactNode
  initialState: OptionState
}

export const Reader = (props: ReaderProps) => {
  const { children, initialState } = props
  const [options, dispatch] = useReducer(reducer, initialState)

  return (
    <div className={clsx(styles.reader, styles[options.mode])}>
      <ReaderContext.Provider value={{ options, dispatch }}>
        {children}
      </ReaderContext.Provider>
    </div>
  )
}

export default Reader
