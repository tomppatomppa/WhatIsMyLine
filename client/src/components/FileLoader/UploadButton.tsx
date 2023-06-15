import React from 'react'

interface UploadButtonProps {
  text: string
  show: boolean
  upload: () => void
}
const UploadButton = ({ text, show, upload }: UploadButtonProps) => {
  return show ? (
    <button onClick={upload} className="border p-1">
      {text}
    </button>
  ) : null
}

export default UploadButton
