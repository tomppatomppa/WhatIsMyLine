import React from 'react'

interface MessageProps {
  type: 'success' | 'error'
  message: string
  show: boolean
}
const Message = ({ show, type, message }: MessageProps) => {
  const variant = type === 'success' ? 'bg-green-200' : 'bg-red-200'
  return show ? <div className={`${variant} `}>{message}</div> : null
}

export default Message
