import { useContext } from 'react'

import { ScenePanelContext } from '../../contexts/ScenePanelContext'

const PanelControls = () => {
  const { panelView, handleChangePanelView } = useContext(ScenePanelContext)

  return (
    <div>
      <select value={panelView} onChange={handleChangePanelView}>
        <option value="scroll">scroll</option>
        <option value="rehearse">rehearse</option>
        <option value="edit">edit</option>
      </select>
    </div>
  )
}

export default PanelControls
