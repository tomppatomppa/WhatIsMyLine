import React from 'react'
import { Line } from './reader.types'

interface LineItemProps {
  line: Line
}
const LineItem = ({ line }: LineItemProps) => {
  return (
    <div className="my-2">
      <p>{line.name}</p>
      <p>{line.lines}</p>
    </div>
  )
}

export default LineItem
