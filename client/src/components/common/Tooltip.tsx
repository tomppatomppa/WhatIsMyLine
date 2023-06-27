import React, { useState } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactNode
}

const Tooltip = ({ text, children }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative"
    >
      <div>{children}</div>
      {showTooltip && (
        <label className="absolute mt-1 shadow-md text-black border rounded-md bg-white p-1">
          {text}
        </label>
      )}
    </div>
  )
}

export default Tooltip
