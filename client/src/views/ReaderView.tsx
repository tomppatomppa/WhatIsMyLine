import { DropResult } from 'react-beautiful-dnd'
import { Reader } from 'src/components/ReaderV3/Reader'
import { useActiveScript, useScriptStore } from 'src/store/scriptStore'
import EmptyReaderView from './EmptyReaderView'

const ReaderView = () => {
  const { reorderScenes, reorderLines } = useScriptStore((state) => state)
  const script = useActiveScript()

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
      reorderScenes(source.index, destination.index)
    }
  }

  if (!script) {
    return <EmptyReaderView />
  }

  return (
    <div>
      <Reader script={script} handleDragEnd={handleDragEnd} />
    </div>
  )
}

export default ReaderView
