import React, { useReducer } from 'react'
import reducer from './reducer'
import ReaderContext from './contexts/ReaderContext'
const initialState = {
  showAll: false,
  highlight: [],
  settings: {
    info: {
      style: {
        textAlign: 'left',
        marginLeft: '10px',
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
export const Reader = ({ children }) => {
  const [options, dispatch] = useReducer(reducer, initialState)

  return (
    <ReaderContext.Provider value={{ options, dispatch }}>
      {children}
    </ReaderContext.Provider>
  )
}

export default Reader
