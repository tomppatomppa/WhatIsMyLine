import { ChangeEvent, useRef } from 'react'

import { AiOutlineUpload } from 'react-icons/ai'
import Tooltip from '../common/Tooltip'

interface MultiFilePickerProps {
  className?: string
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const MultiFilePicker = ({
  className,
  handleFileChange,
}: MultiFilePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!inputRef.current) return
    inputRef.current.click()
  }

  return (
    <Tooltip text="Select file(s)">
      <input
        className="hidden"
        ref={inputRef}
        accept=".pdf"
        multiple
        type="file"
        onChange={handleFileChange}
      />
      <button className={className} onClick={handleClick}>
        <AiOutlineUpload color={'gray'} size={24} />
      </button>
    </Tooltip>
  )
}

export default MultiFilePicker
