import { Form, Formik } from 'formik'
import { Drop } from 'src/components/drag-and-drop'
import { useState } from 'react'

import LineList from '../SceneComponent/LineList'
import { Scene } from '../../reader.types'
import SceneEditorPanel from '../SceneComponent/SceneEditorPanel'

const EditorForm = ({ scene, AddLine, sceneIndex, DeleteLine }: any) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div
      className={`border-l-4 ${
        isEditing ? 'border-red-700' : 'border-green-300'
      }`}
    >
      <Formik
        enableReinitialize={true}
        initialValues={scene as Scene}
        onSubmit={(values) => console.log(values)}
      >
        <Drop key={scene.id} id={scene.id} type="droppable-item">
          <Form autoComplete="off">
            <SceneEditorPanel
              isEditing={isEditing}
              AddLine={AddLine}
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
