import React, { useState } from 'react'

const CurrentScriptContext = React.createContext()

export default CurrentScriptContext

export function ScriptProvider({ children }) {
  const [currentScripts, setCurrentScripts] = useState([])
  const [showScenes, setShowScenes] = useState([])

  const value = {
    currentScripts,
    setCurrentScripts,
    showScenes,
    setShowScenes,
  }

  return (
    <CurrentScriptContext.Provider value={value}>
      {children}
    </CurrentScriptContext.Provider>
  )
}
