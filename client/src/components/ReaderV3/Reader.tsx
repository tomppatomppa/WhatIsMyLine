import { useReducer } from 'react'
import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Drop } from '../drag-and-drop'
import ReaderContext from './contexts/ReaderContext'
import reducer from './reducer'
import SceneList from './components/SceneComponent/SceneList'

interface ReaderProps {
  data: any[]
  handleDragEnd: (values: any) => void
  AddLine: (values: number) => void
  DeleteLine: (sceneIndex: number, lineIndex: number) => void
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
  AddLine,
  DeleteLine,
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
          <SceneList
            scenes={data}
            expanded={expanded}
            handleSetExpanded={handleSetExpanded}
          />
        </Drop>
      </DragDropContext>
    </ReaderContext.Provider>
  )
}
