import { useReducer } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Drop } from '../drag-and-drop'
import ReaderContext from './contexts/ReaderContext'
import reducer from './reducer'
import SceneItem from './components/Scene/SceneItem'
import { ReaderConfiguration, Script } from './reader.types'

/**
 * Initial Configuration object
 * Accessible throughout all child components of Reader.tsx
 * via useReaderContext()
 */
const initialState = {
  mode: 'idle',
  currentScrollTarget: '',
  highlight: [],
  expanded: [],
  isEditing: [], //array for scenes being edited
  settings: {
    info: {
      style: {
        textAlign: 'left',
        marginLeft: '10px',
        fontStyle: 'italic',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
    actor: {
      style: {
        textAlign: 'center',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
  },
} as ReaderConfiguration

interface ReaderProps {
  script: Script
  handleDragEnd: (values: DropResult) => void
}

export const Reader = ({ script, handleDragEnd }: ReaderProps) => {
  const [options, dispatch] = useReducer(reducer, initialState)

  return (
    <ReaderContext.Provider
      value={{ options, dispatch, scriptId: script.script_id }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Drop id="droppable" type="droppable-category">
          {script?.scenes?.map((scene, index) => (
            <SceneItem
              key={index}
              scene={scene}
              sceneIndex={index}
              handleSetExpanded={() =>
                dispatch({ type: 'SET_EXPAND', payload: { sceneId: scene.id } })
              }
              show={options.expanded.includes(scene?.id)}
            />
          ))}
        </Drop>
      </DragDropContext>
    </ReaderContext.Provider>
  )
}
