import { useContext } from 'react'

import { ScenePanelContext } from './contexts/ScenePanelContext'

const PanelControls = () => {
  const { panelView, handleChangePanelView } = useContext(ScenePanelContext)

  return (
    <div>
      <select value={panelView} onChange={handleChangePanelView}>
        <option value="edit">edit</option>
        <option value="rehearse">rehearse</option>
      </select>
    </div>
  )
}

export default PanelControls
