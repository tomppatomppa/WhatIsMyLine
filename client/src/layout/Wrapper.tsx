import React from 'react'

interface WrapperProps {
  children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return <div className="items-center p-2">{children}</div>
}

export default Wrapper
