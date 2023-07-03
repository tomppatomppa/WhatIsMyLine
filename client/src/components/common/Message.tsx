import React from 'react'

interface MessageProps {
  type: string
  message: string
}
const Message = ({ type, message }: MessageProps) => {
  const variant = type === 'success' ? 'bg-green-200' : 'bg-red-200'
  return <div className={`${variant} `}>{message}</div>
}

export default Message
