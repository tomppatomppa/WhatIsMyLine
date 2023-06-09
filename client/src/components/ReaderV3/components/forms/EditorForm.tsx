import { Form, Formik } from 'formik'
import { Drop } from 'src/components/drag-and-drop'
import { useState } from 'react'

import LineList from './LineList'
import { Scene } from '../../reader.types'
import SceneEditorPanel from '../SceneComponent/SceneEditorPanel'

interface EditorFormProps {
  scene: Scene
  sceneIndex: number
}
const EditorForm = ({ scene, sceneIndex }: EditorFormProps) => {
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
        onSubmit={(values: Scene) => console.log(values)}
      >
        <Drop key={scene.id} id={scene.id} type="droppable-item">
          <Form autoComplete="off">
            <SceneEditorPanel
              isEditing={isEditing}
              sceneIndex={sceneIndex}
              setIsEditing={setIsEditing}
            />
            <LineList sceneIndex={sceneIndex} isEditing={isEditing} />
          </Form>
        </Drop>
      </Formik>
    </div>
  )
}

export default EditorForm
