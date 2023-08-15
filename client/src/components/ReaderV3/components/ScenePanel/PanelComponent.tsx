import { useContext } from 'react'
import { ScenePanelContext } from './contexts/ScenePanelContext'

import EditPanel from './EditPanel'
import RehearsePanel from './RehearsePanel'
import { useRootFolder } from 'src/store/scriptStore'
import { ConditionalField } from '../forms/ConditionalField'

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
  }
}

export default PanelComponent
