import React from 'react'

interface UploadButtonProps {
  disabled: boolean
  text: string
  show: boolean
  upload: () => void
}
const UploadButton = ({ disabled, text, show, upload }: UploadButtonProps) => {
  return show ? (
    <button disabled={disabled} onClick={upload} className="border p-1">
      {text}
    </button>
  ) : null
}

export default UploadButton
