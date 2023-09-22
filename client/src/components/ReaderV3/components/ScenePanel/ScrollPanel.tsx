import { useFormikContext } from 'formik'
import { Scene } from '../../reader.types'
import { useEffect } from 'react'
import { useReaderContext } from '../../contexts/ReaderContext'

const ScrollPanel = () => {
  const { values } = useFormikContext<Scene>()
  const { dispatch } = useReaderContext()

  const handleSetCurrentScrollTarget = (currentScrollTarget: string) => {
    dispatch({
      type: 'SET_CURRENT_SCROLL_TARGET',
      payload: { currentScrollTarget },
    })
  }

  useEffect(() => {
    return () => {
      dispatch({ type: 'SET_CURRENT_SCROLL_TARGET', payload: '' })
    }
  }, [dispatch])

  return (
    <div>
      <select onChange={(e) => handleSetCurrentScrollTarget(e.target.value)}>
        {values.data.map((line) => (
          <option>{line.id}</option>
        ))}
      </select>
    </div>
  )
}

export default ScrollPanel
