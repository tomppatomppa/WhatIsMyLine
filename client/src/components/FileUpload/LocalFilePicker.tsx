import { ChangeEvent, useRef } from 'react'

import { AiOutlineUpload } from 'react-icons/ai'
import Tooltip from '../common/Tooltip'

interface LocalFilePickerProps {
  className?: string
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const LocalFilePicker = ({
  className,
  handleFileChange,
}: LocalFilePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!inputRef.current) return
    inputRef.current.click()
  }

  return (
    <Tooltip text="Upload File">
      <input
        className="hidden"
        ref={inputRef}
        accept=".pdf"
        type="file"
        onChange={handleFileChange}
      />
      <button className={className} onClick={handleClick}>
        <AiOutlineUpload color={'gray'} size={24} />
      </button>
    </Tooltip>
  )
}

export default LocalFilePicker
