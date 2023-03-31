import 'core-js'
import React, { useReducer } from 'react'

import ReaderContext from './contexts/ReaderContext'
import optionsReducer from './reducers/optionsReducer'

const initialState = {
  showAll: false,
  highlight: [],
  settings: {
    info: {
      style: {
        textAlign: 'center',
        fontFamily: 'Courier,monospace',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
    actor: {
      style: {
        textAlign: 'center',
        fontFamily: 'Courier,monospace',
        fontSize: '11.8pt',
        color: '#333333',
        backgroundColor: 'red',
      },
    },
  },
}

const Reader = ({ selected, controller, children }) => {
  const [options, dispatch] = useReducer(optionsReducer, initialState)

  if (!selected) {
    return <div>Loading...</div>
  }
  return (
    <ReaderContext.Provider value={{ options, dispatch }}>
      <div className="mx-auto max-w-2xl">{selected.data}</div>
      {children}
      <div>{controller}</div>
    </ReaderContext.Provider>
  )
}

export default Reader
