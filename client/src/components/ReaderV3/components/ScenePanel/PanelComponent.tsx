import { useContext } from 'react'
import { ScenePanelContext } from './contexts/ScenePanelContext'

import EditPanel from './EditPanel'
import RehearsePanel from './RehearsePanel'
const PanelComponent = () => {
  const { panelView } = useContext(ScenePanelContext)

  switch (panelView) {
    case 'edit':
      return <EditPanel />
    case 'rehearse':
      return <RehearsePanel />
  }
}

export default PanelComponent
