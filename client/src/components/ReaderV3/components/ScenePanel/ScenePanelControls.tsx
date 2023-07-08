import React, { useContext } from 'react'

import { ScenePanelContext } from './contexts/ScenePanelContext'
const ScenePanelControls = () => {
  const { panelView, handleChangePanelView } = useContext(ScenePanelContext)
  return (
    <div>
      <select value={panelView} onChange={handleChangePanelView}>
        <option value="edit">edit</option>
        <option value="rehearse">Line Chart</option>
      </select>
    </div>
  )
}

export default ScenePanelControls
