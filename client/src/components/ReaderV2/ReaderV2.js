import 'core-js'
import React, { useReducer } from 'react'
import { reducer } from '../Reader/scriptReducer'
import ReaderContext from './contexts/ReaderContext'

const initialState = {
  showAll: false,
  highlight: [],
  settings: {
    info: { textPosition: 'text-left' },
    actor: { textPosition: 'text-center' },
  },
}

const ReaderV2 = ({ selected }) => {
  const [options, dispatch] = useReducer(reducer, initialState)

  if (!selected) {
    return <div>Loading...</div>
  }
  return (
    <ReaderContext.Provider value={{ options, dispatch }}>
      <div className="mx-auto max-w-2xl">{selected.data}</div>
    </ReaderContext.Provider>
  )
}

export default ReaderV2
