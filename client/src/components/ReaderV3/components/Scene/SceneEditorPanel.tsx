import { useFormikContext } from 'formik'
import useVerifyAudio from '../../hooks/useVerifyAudio'

const SceneEditorPanel = (props: any) => {
  const { dirty, resetForm, values } = useFormikContext()
  const { isEditing, setIsEditing, addLine } = props
  const { setVerify, isValid, data } = useVerifyAudio(values as any)
  const buttonStyle = dirty ? 'text-black' : 'text-gray-400'

  const handleVerify = () => {
    if (!isValid) {
      setVerify(true)
      return
    }
    console.log('Start Rehearsing')
  }
  console.log(data)
  return (
    <div className="flex justify-end gap-2 bg-blue-200 p-2">
      {isEditing ? (
        <>
          <button
            disabled={!dirty}
            type="button"
            className={buttonStyle}
            onClick={() => resetForm()}
          >
            Undo
          </button>
          <button type="button" onClick={addLine}>
            Add Line
          </button>
          <button disabled={!dirty} className={buttonStyle} type="submit">
            Save
          </button>
        </>
      ) : null}
      <button type="button" onClick={handleVerify}>
        {isValid ? 'Ok' : 'Verify'}
      </button>
      <button type="button" onClick={() => setIsEditing(!isEditing)}>
        Edit
      </button>
    </div>
  )
}

export default SceneEditorPanel
