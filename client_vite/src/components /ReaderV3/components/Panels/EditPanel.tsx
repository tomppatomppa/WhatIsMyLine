import { useEffect } from 'react'
import { useFormikContext } from 'formik'
import uuid from 'react-uuid'
import { Scene, SceneLine } from '../../reader.types'
import { useReaderContext } from '../../contexts/ReaderContext'
import { useUpdateScript } from '../../../../store/scriptStore'

function createNewLine() {
  return {
    id: uuid(),
    name: 'Select Name',
    type: 'ACTOR' as SceneLine,
    lines: 'New Line\n',
  }
}

const EditPanel = () => {
  const updateScript = useUpdateScript()
  const { dirty, resetForm, values, submitForm } = useFormikContext<Scene>()
  const { dispatch } = useReaderContext()

  const handleAddLine = () => {
    const newLine = createNewLine()
    const updatedLines = [...values.data]
    updatedLines.unshift(newLine)
    updateScript({ ...values, data: updatedLines })
  }

  useEffect(() => {
    dispatch({ type: 'SET_IS_EDITING', payload: { sceneId: values.id } })

    return () => {
      dispatch({ type: 'SET_IS_EDITING', payload: { sceneId: values.id } })
    }
  }, [dispatch, values.id])

  return (
    <div className="flex gap-4">
      <button
        type="button"
        className={dirty ? 'text-black' : 'text-gray-400'}
        onClick={() => resetForm()}
      >
        Reset
      </button>
      <button type="button" onClick={handleAddLine}>
        Add Line
      </button>
      <button className={dirty ? 'text-black' : 'text-gray-400'} onClick={submitForm} type="submit">
       {"Save"}
      </button>
    </div>
  )
}

export default EditPanel
