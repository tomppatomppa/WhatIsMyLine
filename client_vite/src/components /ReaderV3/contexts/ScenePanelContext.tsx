import React, { useState, createContext } from 'react'
import { PanelView } from '../reader.types'

export const ScenePanelContext = createContext<any>(null)

interface ScenePanelProviderProps {
  children: React.ReactNode
}

const DEFAULT_PANEL_VIEW: PanelView = 'rehearse'

export const ScenePanelProvider = ({ children }: ScenePanelProviderProps) => {
  const [panelView, setPanelView] = useState<PanelView>(DEFAULT_PANEL_VIEW)

  const handleChangePanelView = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPanelView(event?.target.value as PanelView)
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
