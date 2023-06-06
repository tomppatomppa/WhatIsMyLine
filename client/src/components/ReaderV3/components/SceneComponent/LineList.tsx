import { Field, useFormikContext } from 'formik'
import { Drag } from 'src/components/drag-and-drop'

import { DeleteIcon } from '../icons'

import { ConditionalField } from '../forms/ConditionalField'
import { FormikTextArea } from '../forms/FormikTextArea'
import { Scene } from '../../reader.types'

interface LineListProps {
  sceneIndex: boolean
  isEditing: boolean
}
const LineList = ({ sceneIndex, isEditing }: LineListProps) => {
  const { values } = useFormikContext<Scene>()

  return (
    <>
      {values.data.map((line: any, lineIndex: number) => {
        return (
          <Drag
            className="draggable"
            key={line.id}
            id={line.id}
            index={lineIndex}
            isDragDisabled={false}
          >
            <div className="w-full flex flex-col" key={lineIndex}>
              <ConditionalField
                key={lineIndex}
                show={isEditing}
                onShow={() => {}}
                onCollapse={() => {}}
              >
                <div className="w-full bg-neutral-200 flex justify-end ">
                  <label htmlFor={`data[${lineIndex}].type`}>Line Type</label>
                  <Field
                    className="border w-6 border-black"
                    as="select"
                    name={`data[${lineIndex}].type`}
                  >
                    <option value={'INFO'}>Info</option>
                    <option value="ACTOR">Actor</option>
                  </Field>
                  <button
                    className="w-auto"
                    type="button"
                    onClick={() => console.log(sceneIndex, lineIndex)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </ConditionalField>
              <Field
                disabled={values.data[lineIndex].type === 'INFO'}
                className="text-center"
                name={`data[${lineIndex}].name`}
              />
              <FormikTextArea
                disabled={false}
                type={line.type}
                lineName={line.name}
                name={`data[${lineIndex}].lines`}
              />
            </div>
          </Drag>
        )
      })}
    </>
  )
}

export default LineList
