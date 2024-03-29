import React, { useState, useRef } from 'react'

interface DropdownProps {
  title: string
  className?: string
  children: React.ReactNode
}

const Dropdown = ({ title, children, className }: DropdownProps) => {
  const [open, isOpen] = useState(false)

  const targetRef = useRef<HTMLDivElement>(null)

  return (
    <div className={`text-left items-center self-center p-2`}>
      <button
        onClick={() => isOpen(!open)}
        type="button"
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        {title}
      </button>
      {open ? (
        <div
          ref={targetRef}
          className={`${className} absolute text-black mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 cursor-pointer focus:outline-none `}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export default Dropdown
