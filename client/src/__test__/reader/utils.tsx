import { render } from '@testing-library/react'
import { DragDropContext, Drop } from 'src/components/drag-and-drop'

export function renderWithDragAndDrop(ui: React.ReactElement) {
  return {
    ...render(
      <DragDropContext onDragEnd={() => {}}>
        <Drop id="droppable" type="droppable-category">
          {ui}
        </Drop>
      </DragDropContext>
    ),
  }
}
