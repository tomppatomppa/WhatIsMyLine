import { useReducer } from 'react'
import clsx from 'clsx'
import reducer from './reducer'
import ReaderContext from './contexts/ReaderContext'

import styles from './Reader.module.css'
import { ReaderConfiguration, Scene, Script } from './reader.types'

interface ReaderProps {
  children?: React.ReactNode
  script: Script
  initialState: ReaderConfiguration
  renderItem: (scene: Scene, index: number) => React.ReactNode
}

export const Reader = (props: ReaderProps) => {
  const { children, initialState, script, renderItem } = props
  const [options, dispatch] = useReducer(reducer, initialState)

  return (
    <div className={clsx(styles.reader, styles[options.mode])}>
      <ReaderContext.Provider value={{ options, dispatch, script }}>
        {children}
        <section id="scene-content">
          {script.scenes?.map((scene, index) => {
            return (
              <div id="row" key={index}>
                {renderItem(scene, index)}
              </div>
            )
          })}
        </section>
      </ReaderContext.Provider>
    </div>
  )
}

export default Reader
