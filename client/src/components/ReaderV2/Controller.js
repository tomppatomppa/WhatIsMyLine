import { useReaderContext } from './contexts/ReaderContext'
import { optionsActions } from './reducers'
export const Controller = () => {
  const { dispatch } = useReaderContext()
  const { SET_STYLE } = optionsActions

  return (
    <div className="fixed bottom-0 right-0">
      <button
        onClick={() =>
          dispatch(
            SET_STYLE({
              target: 'actor',
              property: 'backgroundColor',
              value: 'green',
            })
          )
        }
      >
        CLICK
      </button>
    </div>
  )
}
