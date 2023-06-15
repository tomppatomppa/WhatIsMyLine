import { useReducer } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { Drop } from '../drag-and-drop'
import ReaderContext from './contexts/ReaderContext'
import reducer from './reducer'
import SceneItem from './components/Scene/SceneItem'
import { ReaderConfiguration, Scene } from './reader.types'

interface ReaderProps {
  data: Scene[]
  handleDragEnd: (values: DropResult) => void
}

const initialState = {
  mode: 'idle',
  highlight: [],
  expanded: [],
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

export const Reader = ({ data, handleDragEnd }: ReaderProps) => {
  const [options, dispatch] = useReducer(reducer, initialState)

  return (
    <ReaderContext.Provider value={{ options, dispatch }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Drop id="droppable" type="droppable-category">
          {data.map((scene, index) => (
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
