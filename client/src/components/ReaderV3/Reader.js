import React, { useReducer, useState } from 'react'
import reducer from './reducer'
import ReaderContext, { useReaderContext } from './contexts/ReaderContext'
import { CLOSE_ALL, OPEN_ALL } from './actions'
import { BsThreeDots } from 'react-icons/bs'

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
    <div className="max-w-4xl mx-auto">
      <ReaderContext.Provider value={{ options, dispatch }}>
        {/* <Controller /> */}
        {children}
      </ReaderContext.Provider>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
const Controller = () => {
  const [minimized, setMinimized] = useState(false)
  const { dispatch } = useReaderContext()

  return (
    <div className="fixed bottom-12 right-12 bg-green-200">
      <div className="absolute -top-5 right-0 bg-white h-2">
        <button onClick={() => setMinimized(!minimized)}>
          <BsThreeDots size={24} />
        </button>
      </div>
      {minimized && (
        <div>
          <button
            className="border border-black p-2"
            onClick={() => dispatch(OPEN_ALL())}
          >
            open
          </button>
          <button
            className="border border-black p-2"
            onClick={() => dispatch(CLOSE_ALL())}
          >
            close
          </button>
        </div>
      )}
    </div>
  )
}
export default Reader
