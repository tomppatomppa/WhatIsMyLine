import Select from 'react-select'
import { Actor } from '../reader.types'

interface ReaderSelectActorProps {
  actors: Actor[]
}
const ReaderSelectActor = (props: ReaderSelectActorProps) => {
  const { actors } = props

  const actorOptions = actors.map((actor) => {
    return { label: actor.id, value: actor.id }
  })

  return (
    <Select
      id="select"
      isMulti
      name="actors"
      options={actorOptions}
      className="basic-multi-select"
      classNamePrefix="select"
    />
  )
}

export default ReaderSelectActor
