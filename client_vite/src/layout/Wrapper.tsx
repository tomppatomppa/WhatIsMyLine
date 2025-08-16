import React from 'react'

interface WrapperProps {
  children: React.ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return <div className=" md:mt-0">{children}</div>
}

export default Wrapper
