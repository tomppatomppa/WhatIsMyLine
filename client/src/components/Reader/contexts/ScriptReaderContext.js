import { createContext, useContext } from 'react'

const ScriptReaderContext = createContext(null)

export function useScriptReaderContext() {
  const context = useContext(ScriptReaderContext)
  if (!context) {
    throw new Error(
      'ScriptReader.* component must be rendered as a child of ScriptReader component'
    )
  }
  return context
}

export default ScriptReaderContext
