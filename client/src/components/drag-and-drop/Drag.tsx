import { DraggableChildrenFn } from 'react-beautiful-dnd'
import { Draggable, DraggableId } from 'react-beautiful-dnd'

interface DragProps extends Omit<DraggableChildrenFn, 'children'> {
  id: DraggableId
  className?: string
  index: number
  children: React.ReactNode
  isDragDisabled: boolean
}
export const Drag = ({
  id,
  index,
  children,
  isDragDisabled,
  ...props
}: DragProps) => {
  return (
    <Draggable isDragDisabled={isDragDisabled} draggableId={id} index={index}>
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...props}
          >
            {children}
          </div>
        )
      }}
    </Draggable>
  )
}
