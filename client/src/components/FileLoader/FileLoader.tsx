
interface FileLoaderProps {
  handleClick: () => void
  handleAddFile: () => void
  inputRef: React.RefObject<HTMLInputElement>
}

const FileLoader = ({ handleClick, handleAddFile, inputRef }: FileLoaderProps) => {
  return (
    <div>
      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        onChange={handleAddFile}
      />
      <button className="self-center text-4xl" onClick={handleClick}>
        +
      </button>
    </div>
  )
}

export default FileLoader
