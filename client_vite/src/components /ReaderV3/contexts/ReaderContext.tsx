import { createContext, useContext } from 'react'

//TODO: fix type
const ReaderContext = createContext<any>(null)

export function useReaderContext() {
  const context = useContext(ReaderContext)
  if (!context) {
    throw new Error(
      'Reader.* component must be rendered as a child of Reader component'
    )
  }
  return context
}

export default ReaderContext
