import { useContext } from 'react'
import { ScenePanelContext } from './contexts/ScenePanelContext'
const PanelComponent = () => {
  const { panelView } = useContext(ScenePanelContext)

  switch (panelView) {
    case 'edit':
      return <div>edit panel</div>
    case 'rehearse':
      return <div>Rehearsal panel</div>
  }
}

export default PanelComponent
