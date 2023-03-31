import { createContext, useContext } from 'react'

const ReaderContext = createContext(null)

export function useReaderContext() {
  const context = useContext(ReaderContext)
  if (!context) {
    throw new Error(
      'ScriptReader.* component must be rendered as a child of ScriptReader component'
    )
  }
  return context
}

export default ReaderContext
