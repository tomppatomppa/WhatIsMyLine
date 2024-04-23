import { useContext } from 'react'
import { ScenePanelContext } from '../../contexts/ScenePanelContext'

import EditPanel from '../Panels/EditPanel'
import RehearsePanel from '../Panels/RehearsePanel'
import { ConditionalField } from '../../../common/ConditionalField'
import ScrollPanel from '../Panels/ScrollPanel'
import { useRootFolder } from '../../../../store/scriptStore'

const PanelComponent = () => {
  const { panelView } = useContext(ScenePanelContext)
  const root = useRootFolder()

  switch (panelView) {
    case 'rehearse':
      return (
        <ConditionalField
          show={!!root}
          onCollapse={() => {}}
          onShow={() => {}}
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
