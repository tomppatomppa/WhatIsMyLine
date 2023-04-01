import 'core-js'
import React, { useReducer, useState } from 'react'

import ReaderContext from './contexts/ReaderContext'
import optionsReducer from './reducers/optionsReducer'

const initialState = {
  showAll: false,
  highlight: [],
  settings: {
    info: {
      style: {
        textAlign: 'left',
        textIndent: '1em',
        fontStyle: 'italic',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
    actor: {
      style: {
        textAlign: 'center',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
  },
}

const Reader = ({ selected, children }) => {
  const [options, dispatch] = useReducer(optionsReducer, initialState)
  const [scenes, setScenes] = useState([
    '13811 EXT. KLÖSUS KONTOR',
    '11003 INT. MÖTESRUM',
  ])

  if (!selected) {
    return null
  }
  return (
    <ReaderContext.Provider value={{ options, dispatch, scenes }}>
      <div className="mx-auto max-w-2xl">{selected.data}</div>
      {children}
    </ReaderContext.Provider>
  )
}

export default Reader
