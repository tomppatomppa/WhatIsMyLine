// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState } from 'react'
import './styles.css'
import { Drag, DragDropContext, Drop } from './components/drag-and-drop'

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const NestedListComponent = () => {
  const [categories, setCategories] = useState([
    {
      id: 'q101',
      name: 'Category 1',
      items: [
        { id: 'abc', name: 'First' },
        { id: 'def', name: 'Second' },
      ],
    },
    {
      id: 'wkqx',
      name: 'Category 2',
      items: [
        { id: 'ghi', name: 'Third' },
        { id: 'jkl', name: 'Fourth' },
      ],
    },
  ]) as any

  const handleDragEnd = (result: any) => {
    const { type, source, destination } = result
    if (!destination) return

    const sourceCategoryId = source.droppableId
    const destinationCategoryId = destination.droppableId

    if (type === 'droppable-item') {
      if (sourceCategoryId === destinationCategoryId) {
        const updatedOrder = reorder(
          categories.find((category) => category.id === sourceCategoryId).items,
          source.index,
          destination.index
        )
        const updatedCategories = categories.map((category) =>
          category.id !== sourceCategoryId
            ? category
            : { ...category, items: updatedOrder }
        )

        setCategories(updatedCategories)
        // } else {
        //   const sourceOrder = categories.find(
        //     (category) => category.id === sourceCategoryId
        //   ).items
        //   const destinationOrder = categories.find(
        //     (category) => category.id === destinationCategoryId
        //   ).items

        //   const [removed] = sourceOrder.splice(source.index, 1)
        //   destinationOrder.splice(destination.index, 0, removed)

        //   destinationOrder[removed] = sourceOrder[removed]
        //   delete sourceOrder[removed]

        //   const updatedCategories = categories.map((category) =>
        //     category.id === sourceCategoryId
        //       ? { ...category, items: sourceOrder }
        //       : category.id === destinationCategoryId
        //       ? { ...category, items: destinationOrder }
        //       : category
        //   )

        //   setCategories(updatedCategories)
        // }
      }
    }

    // Reordering categories
    if (type === 'droppable-category') {
      const updatedCategories = reorder(
        categories,
        source.index,
        destination.index
      )

      setCategories(updatedCategories)
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Drop id="droppable" type="droppable-category">
        {categories.map((category, categoryIndex) => {
          return (
            <Drag
              className="draggable-category"
              key={category.id}
              id={category.id}
              index={categoryIndex}
            >
              <div className="category-container">
                <h2 className="item">{category.name}</h2>
                <Drop key={category.id} id={category.id} type="droppable-item">
                  {category.items.map((item, index) => {
                    return (
                      <Drag
                        className="draggable"
                        key={item.id}
                        id={item.id}
                        index={index}
                      >
                        <div className="item">{item.name}</div>
                      </Drag>
                    )
                  })}
                </Drop>
              </div>
            </Drag>
          )
        })}
      </Drop>
    </DragDropContext>
  )
}
