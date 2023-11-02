import React from 'react'

interface DrawerProps {
  show: boolean
  children: React.ReactNode
}
const Drawer = ({ show, children }: DrawerProps) => {
  return (
    <div
      className={`${
        show ? 'translate-x-12' : '-translate-x-44'
      } absolute transition-all -z-10 duration-200 flex w-48 md:w-auto top-0 h-screen bg-white`}
    >
      {children}
    </div>
  )
}

export default Drawer
