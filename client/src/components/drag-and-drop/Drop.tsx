import { useEffect, useState } from 'react'
import { Droppable, DroppableProps } from 'react-beautiful-dnd'

//Fix for react strict mode
//https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
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

interface DropProps extends Omit<DroppableProps, 'children' | 'droppableId'> {
  id: string
  children?: React.ReactNode
}
export const Drop = ({ id, type, ...props }: DropProps) => {
  return (
    <StrictModeDroppable droppableId={id} type={type}>
      {(provided, snapshot) => {
        return (
          <div  ref={provided.innerRef} {...provided.droppableProps} {...props} 
          >
            {props.children}
            {provided.placeholder}
          </div>
        )
      }}
    </StrictModeDroppable>
  )
}
