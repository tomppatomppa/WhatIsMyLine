const SceneEditorActions = (props: any) => {
  const { isEditing, setIsEditing, AddLine, sceneIndex } = props
  return (
    <div className="flex justify-end gap-2 bg-blue-200 p-2">
      {isEditing ? (
        <>
          <button
            type="button"
            disabled={!isEditing}
            onClick={() => AddLine(sceneIndex)}
          >
            Add Line
          </button>
          <button type="submit" disabled={!isEditing}>
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

export default SceneEditorActions
