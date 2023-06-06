import { Field, useFormikContext } from 'formik'
import { Drag } from 'src/components/drag-and-drop'
import { DeleteIcon } from '../icons'
import { ConditionalField } from './ConditionalField'
import { FormikTextArea } from './FormikTextArea'
import { Actor, LineType, Scene } from '../../reader.types'
import { useReaderContext } from '../../contexts/ReaderContext'

interface LineListProps {
  sceneIndex: boolean
  isEditing: boolean
}
const LineList = ({ sceneIndex, isEditing }: LineListProps) => {
  const { values } = useFormikContext<Scene>()
  const { options, dispatch } = useReaderContext()

  const getLineStyle = (type: LineType) => {
    const style = options.settings[type.toLowerCase()].style
    return style || {}
  }

  const getTextAreaColor = (name: string) => {
    const actor = options?.highlight.find((item: Actor) => item.id === name)
    return actor ? actor.style : {}
  }

  return (
    <>
      {values.data.map((line: any, lineIndex: number) => {
        return (
          <Drag
            className="mt-3"
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
                    <option value="INFO">Info</option>
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
              <span
                onClick={() => {
                  if (!isEditing) {
                    dispatch({
                      type: 'HIGHLIGHT_TARGET',
                      payload: { target: line.name },
                    })
                  }
                }}
              >
                <Field
                  style={getLineStyle(line.type)}
                  disabled={!isEditing || line.type === 'INFO'}
                  name={`data[${lineIndex}].name`}
                />
              </span>
              <FormikTextArea
                style={{
                  ...getLineStyle(line.type),
                  ...getTextAreaColor(line.name),
                }}
                disabled={!isEditing}
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
