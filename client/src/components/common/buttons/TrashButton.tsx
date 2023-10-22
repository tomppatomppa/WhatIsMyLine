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
      className="w-6 flex-0 mx-auto flex items-center"
    >
      <AiOutlineDelete color="red" />
    </button>
  )
}

export default TrashButton
