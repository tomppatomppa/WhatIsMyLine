import React from 'react'

interface WrapperProps {
  children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return <div className="relative items-center p-2 w-auto">{children}</div>
}

export default Wrapper
