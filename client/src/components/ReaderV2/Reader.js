import 'core-js'
import React, { useReducer } from 'react'

import ReaderContext from './contexts/ReaderContext'
import optionsReducer from './reducers/optionsReducer'

const initialState = {
  showAll: false,
  highlight: [],
  settings: {
    info: { textPosition: 'text-left' },
    actor: { textPosition: 'text-center' },
  },
}

const Reader = ({ selected, children }) => {
  const [options, dispatch] = useReducer(optionsReducer, initialState)

  if (!selected) {
    return <div>Loading...</div>
  }
  return (
    <ReaderContext.Provider value={{ options, dispatch }}>
      <div className="mx-auto max-w-2xl">{selected.data}</div>
      {children}
    </ReaderContext.Provider>
  )
}

export default Reader
