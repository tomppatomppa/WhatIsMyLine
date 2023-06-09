import { useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { Reader } from 'src/components/ReaderV3/Reader'
import { useActiveScript, useScriptStore } from 'src/store/scriptStore'

type OrderHistory = [number, number]

const ReaderPage = () => {
  const { reorderScenes, reorderLines } = useScriptStore((state) => state)
  const script = useActiveScript()
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([])
  const hasEdited = orderHistory.length > 0
  console.log(script)
  const handleDragEnd = (result: DropResult) => {
    const { type, source, destination } = result
    if (!destination) return

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return

    if (type === 'droppable-item' && script) {
      reorderLines(destination.droppableId, source.index, destination.index)
    } else {
      setOrderHistory([...orderHistory, [source.index, destination.index]])
      reorderScenes(source.index, destination.index)
    }
  }

  const handleReverseChanges = () => {
    if (!hasEdited) return

    const history = [...orderHistory]
    const previousEdit = history.splice(-1)[0]
    //Reverse indexes
    reorderScenes(previousEdit[1], previousEdit[0])
    setOrderHistory(history)
  }

  return (
    <div>
      {hasEdited ? (
        <button
          className="self-end bg-red-200 p-2"
          onClick={handleReverseChanges}
        >
          Undo
        </button>
      ) : null}
      {script && <Reader data={script.scenes} handleDragEnd={handleDragEnd} />}
    </div>
  )
}

export default ReaderPage
