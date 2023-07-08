import React, { ChangeEvent } from 'react'
import Tooltip from '../common/Tooltip'
import { AiOutlineUpload } from 'react-icons/ai'

interface TestfilePickerProps {
  className?: string
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
}
const TestfilePicker = ({
  className,
  handleFileChange,
}: TestfilePickerProps) => {
  return (
    <Tooltip text="Upload testfile">
      <button className={className}>
        <AiOutlineUpload size={24} />
      </button>
    </Tooltip>
  )
}

export default TestfilePicker
