import { useFormikContext } from 'formik'
import SceneRehearsalPanel from './SceneRehearsalPanel'

const SceneEditorPanel = (props: any) => {
  const { dirty, resetForm } = useFormikContext()
  const { isEditing, setIsEditing, addLine } = props

  return (
    <div className="sticky top-0 flex justify-end gap-2 bg-blue-200 p-2">
      {isEditing ? (
        <>
          <button
            disabled={!dirty}
            type="button"
            className={dirty ? 'text-black' : 'text-gray-400'}
            onClick={() => resetForm()}
          >
            Undo
          </button>
          <button type="button" onClick={addLine}>
            Add Line
          </button>
          <button
            disabled={!dirty}
            className={dirty ? 'text-black' : 'text-gray-400'}
            type="submit"
          >
            Save
          </button>
        </>
      ) : (
        <SceneRehearsalPanel />
      )}
      <button type="button" onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
    </div>
  )
}

export default SceneEditorPanel
