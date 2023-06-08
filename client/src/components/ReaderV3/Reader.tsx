import { useReducer } from 'react'
import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Drop } from '../drag-and-drop'
import ReaderContext from './contexts/ReaderContext'
import reducer from './reducer'
import SceneItem from './components/SceneComponent/SceneItem'

interface ReaderProps {
  data: any[]
  handleDragEnd: (values: any) => void
}

const initialState = {
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
} as any

export const Reader = ({
  data,
  handleDragEnd,
}: ReaderProps) => {
  const [options, dispatch] = useReducer(reducer, initialState)
  const [expanded, setExpanded] = useState<string[]>([])

  const handleSetExpanded = (id: string) => {
    let updatedExpanded
    if (expanded.includes(id)) {
      updatedExpanded = expanded.filter((item) => item !== id)
    } else {
      updatedExpanded = [...expanded, id]
    }
    setExpanded(updatedExpanded)
  }

  return (
    <ReaderContext.Provider value={{ options, dispatch }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Drop id="droppable" type="droppable-category">
          {data.map((scene, index) => (
            <SceneItem
              key={index}
              scene={scene}
              sceneIndex={index}
              handleSetExpanded={() => handleSetExpanded(scene.id)}
              show={expanded.includes(scene.id)} 
            />
          ))}
        </Drop>
      </DragDropContext>
    </ReaderContext.Provider>
  )
}
