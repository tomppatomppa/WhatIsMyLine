import FileUpload from 'src/containers/FileUpload'

const EmptyScriptList = () => {
  return (
    <div className="mt-24">
      <h1 className="font-bold ">No Scripts</h1>
      <p>Upload From Device</p>
      <p>Or Google Drive</p>
      <FileUpload />
    </div>
  )
}

export default EmptyScriptList
