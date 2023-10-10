import React, { useState } from 'react'

interface TooltipProps {
  text: string
  children: React.ReactNode
  className?: string
}

const Tooltip = ({ text, children, className }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`relative`}
    >
      <div>{children}</div>
      {showTooltip && (
        <label
          className={`absolute whitespace-nowrap mt-1 shadow-md text-black border rounded-md bg-white p-1 ${className}`}
        >
          {text}
        </label>
      )}
    </div>
  )
}

export default Tooltip
