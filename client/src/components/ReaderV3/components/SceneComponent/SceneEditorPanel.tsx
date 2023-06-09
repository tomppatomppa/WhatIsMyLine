import { useFormikContext } from 'formik'

const SceneEditorPanel = (props: any) => {
  const { dirty } = useFormikContext()
  const { isEditing, setIsEditing } = props
  
  return (
    <div className="flex justify-end gap-2 bg-blue-200 p-2">
      {isEditing ? (
        <>
          <button type="button" onClick={() => console.log('Undo')}>
            Undo
          </button>
          <button type="button" onClick={() => console.log("Add line")}>
            Add Line
          </button>
          <button disabled={!dirty} className={dirty ? 'text-black' : 'text-gray-400'} type="submit">
            Save
          </button>
        </>
      ) : null}
      <button type="button" onClick={() => setIsEditing(!isEditing)}>
        Edit
      </button>
    </div>
  )
}

export default SceneEditorPanel
