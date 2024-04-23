import React from 'react'

import { ScenePanelProvider } from '../../contexts/ScenePanelContext'
import PanelControls from './PanelControls'

interface PanelWidgetProps {
  title?: string
  children: React.ReactNode
}

const PanelWidget = ({ title, children }: PanelWidgetProps) => {
  return (
    <ScenePanelProvider>
      <section className="sticky top-0 flex items-center cursor-default justify-end gap-2 border-b-2 bg-white shadow-sm p-2 h-12">
        <h2>{title}</h2>
        {children}
        <PanelControls />
      </section>
    </ScenePanelProvider>
  )
}

export default PanelWidget
