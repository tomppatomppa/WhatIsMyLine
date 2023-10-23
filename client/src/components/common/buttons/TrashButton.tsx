import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'

interface TrashButtonProps {
  onClick: () => void
}
const TrashButton = ({ onClick }: TrashButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="w-6 flex-none mx-auto flex items-center"
    >
      <AiOutlineDelete color="red" />
      <span className="hidden">Delete</span>
    </button>
  )
}

export default TrashButton
