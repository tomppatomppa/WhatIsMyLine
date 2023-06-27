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
    <>
      <input
        className="hidden"
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
      />
      <Tooltip text="tooltip">
        <button className={className} onClick={handleClick}>
          <AiOutlineUpload size={24} />
        </button>
      </Tooltip>
    </>
  )
}

export default LocalFilePicker
