import { useReducer } from 'react'
import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Drag, Drop } from '../drag-and-drop'

import ReaderContext from './contexts/ReaderContext'
import reducer from './reducer'

import EditorForm from './components/forms/EditorForm'

interface ReaderInteractiveProps {
  data: any[]
  handleDragEnd: (values: any) => void
  AddLine: (values: number) => void
  DeleteLine: (values: number) => void
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

const ReaderInteractive = ({
  data,
  handleDragEnd,
  AddLine,
  DeleteLine,
}: ReaderInteractiveProps) => {
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
          {data.map((scene, sceneIndex) => {
            return (
              <Drag
                className="draggable-category"
                key={scene.id}
                id={scene.id}
                index={sceneIndex}
              >
                <div className="category-container">
                  <h2
                    onClick={() => handleSetExpanded(scene.id)}
                    className="item"
                  >
                    {scene.id}
                  </h2>
                  {expanded.includes(scene.id) && (
                    <EditorForm
                      scene={scene}
                      AddLine={AddLine}
                      sceneIndex={sceneIndex}
                      DeleteLine={DeleteLine}
                    />
                  )}
                </div>
              </Drag>
            )
          })}
        </Drop>
      </DragDropContext>
    </ReaderContext.Provider>
  )
}

export default ReaderInteractive
