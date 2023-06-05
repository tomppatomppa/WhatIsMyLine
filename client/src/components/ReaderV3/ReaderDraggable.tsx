import { useReducer, useState, useEffect } from 'react'
import clsx from 'clsx'
import reducer from './reducer'
import ReaderContext from './contexts/ReaderContext'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProps,
} from 'react-beautiful-dnd'
import styles from './Reader.module.css'
import { ReaderConfiguration, Scene, Script } from './reader.types'
import DraggableSceneItem from './components/SceneComponent/DraggableSceneItem'
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return <Droppable {...props}>{children}</Droppable>
}
interface ReaderDraggableProps {
  children?: React.ReactNode
  script: Scene[]
  initialState: ReaderConfiguration
  renderItem: (scene: Scene, index: number) => React.ReactNode
  onDragEnd: (value: any) => void
}

export const ReaderDraggable = (props: ReaderDraggableProps) => {
  const { children, initialState, script, renderItem, onDragEnd } = props
  const [options, dispatch] = useReducer(reducer, initialState)
  const [open, setOpen] = useState(false)
  return (
    <div className={clsx(styles.reader)}>
      <ReaderContext.Provider value={{ options, dispatch, script }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <StrictModeDroppable droppableId="scene">
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps}>
                {script.map(({ id, data }, index) => (
                  <DraggableSceneItem
                    key={index}
                    id={id}
                    index={index}
                    data={data}
                  />
                  //   <Draggable key={id} draggableId={id.toString()} index={index}>
                  //     {(provided) => (
                  //       <li ref={provided.innerRef} {...provided.draggableProps}>
                  //         <div className="flex justify-center">
                  //           <span className="flex-1" />
                  //           <div className={clsx(`scene bg-blue-300`)}>{id}</div>
                  //           <span
                  //             className="flex-1 text-end"
                  //             {...provided.dragHandleProps}
                  //           >
                  //             #
                  //           </span>
                  //         </div>
                  //         {data.map((item, index) => (
                  //           <div key={index}>{item.lines} </div>
                  //         ))}
                  //       </li>
                  //     )}
                  //   </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </StrictModeDroppable>
        </DragDropContext>
        {/* {children}
        <section id="scene-content">
          {script.scenes?.map((scene, index) => {
            return (
              <div id="row" key={index}>
                {renderItem(scene, index)}
              </div>
            )
          })}
        </section> */}
      </ReaderContext.Provider>
    </div>
  )
}

export default ReaderDraggable
