import { useContext } from 'react'
import { ScenePanelContext } from '../../contexts/ScenePanelContext'

const PanelControls = () => {
  useContext(ScenePanelContext)
  return null
  // return (
  //   <select
  //     className="justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
  //     value={panelView}
  //     onChange={handleChangePanelView}
  //   >
  //     <option value="scroll">Scroll</option>
  //     <option value="rehearse">Rehearse</option>
  //     <option value="edit">Edit</option>
  //   </select>
  // )
}

export default PanelControls
