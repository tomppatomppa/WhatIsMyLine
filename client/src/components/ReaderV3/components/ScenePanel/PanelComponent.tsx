import { useContext } from 'react'
import { ScenePanelContext } from '../../contexts/ScenePanelContext'

import EditPanel from './EditPanel'
import RehearsePanel from './RehearsePanel'
import { useRootFolder } from 'src/store/scriptStore'
import { ConditionalField } from '../forms/ConditionalField'
import ScrollPanel from './ScrollPanel'

const PanelComponent = () => {
  const { panelView } = useContext(ScenePanelContext)
  const root = useRootFolder()

  switch (panelView) {
    case 'rehearse':
      return (
        <ConditionalField
          show={!!root}
          onCollapse={() => console.log()}
          onShow={() => console.log()}
          reason="No Root folder, click Profile and Sync Drive"
        >
          <RehearsePanel />
        </ConditionalField>
      )
    case 'edit':
      return <EditPanel />
    case 'scroll':
      return <ScrollPanel />
  }
}

export default PanelComponent
