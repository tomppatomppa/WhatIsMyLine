import { useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { Reader } from 'src/components/ReaderV3/Reader'
import { useActiveScript, useScriptStore } from 'src/store/scriptStore'
import { useAuth } from 'src/store/userStore'

type OrderHistory = [number, number]

export function Loader() {
  return useAuth()
}

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

  return (
    <>{script && <Reader script={script} handleDragEnd={handleDragEnd} />}</>
  )
}

export default ReaderView
