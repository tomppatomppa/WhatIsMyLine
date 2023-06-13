import { Form, Formik } from 'formik'
import { Drop } from 'src/components/drag-and-drop'
import { useState } from 'react'

import LineList from './LineList'
import { Scene } from '../../reader.types'
import SceneEditorPanel from '../SceneComponent/SceneEditorPanel'

interface EditorFormProps {
  scene: Scene
  sceneIndex: number
  onSubmit: (scene: Scene) => void
  addLine: () => void
  deleteLine: (lineIndex: number) => void
}

const EditorForm = ({ scene, sceneIndex, onSubmit, addLine, deleteLine }: EditorFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div
      className={`border-l-4 ${
        isEditing ? 'border-red-700' : 'border-green-300'
      }`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={scene}
        onSubmit={(values) => {
          setIsEditing(false)
          onSubmit(values)
        }}
      >
        <Drop key={scene.id} id={scene.id} type="droppable-item">
          <Form autoComplete="off">
            <SceneEditorPanel
              isEditing={isEditing}
              sceneIndex={sceneIndex}
              setIsEditing={setIsEditing}
              addLine={addLine}
            />
            <LineList isEditing={isEditing} deleteLine={deleteLine} />
          </Form>
        </Drop>
      </Formik>
    </div>
  )
}

export default EditorForm
