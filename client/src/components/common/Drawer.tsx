import React from 'react'

interface DrawerProps {
  show: boolean
  children: React.ReactNode
}
const Drawer = ({ show, children }: DrawerProps) => {
  return (
    <div
      className={`${
        show ? 'translate-x-12' : '-translate-x-96'
      } absolute transition-all -z-10 duration-200 flex justify-center w-96 top-0 h-screen bg-white border-r-2 shadow-lg`}
    >
      {children}
    </div>
  )
}

export default Drawer
