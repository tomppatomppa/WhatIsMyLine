import React from 'react'

const FileLoader = ({ handleClick, handleAddFile, inputRef }) => {
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
