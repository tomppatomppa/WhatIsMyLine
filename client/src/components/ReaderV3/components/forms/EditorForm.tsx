import { Field, Form, Formik } from 'formik'
import { Drag, Drop } from 'src/components/drag-and-drop'
import { useState } from 'react'
import { ConditionalField } from './ConditionalField'
import { FormikTextArea } from './FormikTextArea'
import SceneEditorActions from '../SceneComponent/SceneEditorActions'
import { DeleteIcon } from '../icons'
import LineList from '../SceneComponent/LineList'
import { Scene } from '../../reader.types'

const EditorForm = ({ scene, AddLine, sceneIndex, DeleteLine }: any) => {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Formik
      enableReinitialize={true}
      initialValues={scene as Scene}
      onSubmit={(values) => console.log(values)}
    >
      <Drop key={scene.id} id={scene.id} type="droppable-item">
        <Form autoComplete="off">
          <SceneEditorActions
            isEditing={isEditing}
            AddLine={AddLine}
            sceneIndex={sceneIndex}
            setIsEditing={setIsEditing}
          />
          <LineList sceneIndex={sceneIndex} isEditing={isEditing} />
        </Form>
      </Drop>
    </Formik>
  )
}

export default EditorForm
