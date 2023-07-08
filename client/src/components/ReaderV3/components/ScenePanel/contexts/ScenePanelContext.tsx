import React, { useState, createContext } from 'react'
import { PanelView } from '../../../reader.types'

export const ScenePanelContext = createContext<any>(null)

interface ScenePanelProviderProps {
  children: React.ReactNode
}

export const ScenePanelProvider = ({ children }: ScenePanelProviderProps) => {
  const [panelView, setPanelView] = useState<PanelView>('rehearse')

  const handleChangePanelView = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPanelView(event?.target.value as any)
  }

  const value = {
    panelView,
    handleChangePanelView,
  }

  return (
    <ScenePanelContext.Provider value={value}>
      {children}
    </ScenePanelContext.Provider>
  )
}
