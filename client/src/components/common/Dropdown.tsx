import React, { useState } from 'react'

interface DropdownProps {
  title: string
  children: React.ReactNode
}
const Dropdown = ({ title, children }: DropdownProps) => {
  const [open, isOpen] = useState(false)

  return (
    <div className="relative inline-block text-left items-center self-center p-2">
      <div>
        <button
          onClick={() => isOpen(!open)}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          {title}
        </button>
      </div>
      {open ? (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 cursor-pointer focus:outline-none">
          {children}
        </div>
      ) : null}
    </div>
  )
}

export default Dropdown
