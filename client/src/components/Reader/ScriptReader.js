import React, { useReducer } from 'react'
import ScriptReaderContext from './contexts/ScriptReaderContext'
import { reducer } from './scriptReducer'

const initialState = {
  showAll: true,
  highlight: [],
  settings: {
    info: { textPosition: 'text-left' },
    actor: { textPosition: 'text-center' },
  },
}

const ScriptReader = ({ script, renderItems }) => {
  const [options, dispatch] = useReducer(reducer, initialState)
  return (
    <ScriptReaderContext.Provider value={{ script, options, dispatch }}>
      <div className="text-center my-6">filename: {script.filename}</div>
      <div>{renderItems}</div>
    </ScriptReaderContext.Provider>
  )
}

export default ScriptReader
