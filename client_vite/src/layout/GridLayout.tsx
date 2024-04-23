import React from 'react'

interface GridLayoutInterface {
  children: React.ReactNode
}
const GridLayout = ({ children }: GridLayoutInterface) => {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-4 max-[767px]:mx-auto max-[767px]:max-w-[400px] sm:justify-items-stretch md:grid-cols-3 lg:gap-8">
      {children}
    </div>
  )
}

export default GridLayout
