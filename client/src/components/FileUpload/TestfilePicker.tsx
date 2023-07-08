import Tooltip from '../common/Tooltip'
import { AiOutlineUpload } from 'react-icons/ai'

interface TestfilePickerProps {
  className?: string
  handleFileChange: (e: File) => void
}

const TestfilePicker = ({
  className,
  handleFileChange,
}: TestfilePickerProps) => {
  const handleFile = async () => {
    const testfile = require('../../assets/testfile.pdf')
    try {
      const response = await fetch(testfile)
      const blobData = await response.blob()
      const file = new File([blobData], 'testfile.pdf', {
        type: 'application/pdf',
      })

      handleFileChange(file)
    } catch (error) {
      console.error('Error loading file:', error)
    }
  }

  return (
    <Tooltip text="Upload testfile">
      <label htmlFor="testfile-input">
        <button
          onClick={() => handleFile()}
          className={className}
          type="button"
        >
          <AiOutlineUpload color="orange" size={24} />
        </button>
      </label>
    </Tooltip>
  )
}

export default TestfilePicker
