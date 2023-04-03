import React, { useReducer } from 'react'
import reducer from './reducer'
import ReaderContext, { useReaderContext } from './contexts/ReaderContext'
import { CLOSE_ALL, OPEN_ALL } from './actions'

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
      <Controller />
      {children}
    </ReaderContext.Provider>
  )
}

const Controller = () => {
  const { options, dispatch } = useReaderContext()

  return (
    <div>
      <div className="fixed top-24 right-12">
        {options.highlight.map((item, index) => (
          <p key={index}>{item.id}</p>
        ))}
        <button onClick={() => dispatch(OPEN_ALL())}>open</button>
        <button onClick={() => dispatch(CLOSE_ALL())}>close</button>
      </div>
    </div>
  )
}
export default Reader
