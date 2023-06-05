import clsx from 'clsx'
import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

interface DraggableSceneItemProps {
  ref: React.RefObject<HTMLElement>
}
const DraggableSceneItem = (props: any) => {
  const { id, data, index, dragItemStyle = {}, children } = props
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided) => (
        <li ref={provided.innerRef} {...provided.draggableProps}>
          <div className="flex justify-center">
            <span className="flex-1" />
            <div className={clsx(`scene bg-blue-300`)}>{id}</div>
            <span className="flex-1 text-end" {...provided.dragHandleProps}>
              #
            </span>
          </div>
          {data.map((item: any, index: number) => (
            <div key={index}>{item.lines} </div>
          ))}
        </li>
      )}
    </Draggable>
  )
}

export default DraggableSceneItem
