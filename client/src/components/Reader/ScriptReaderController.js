import React from 'react'
import { CLOSE_ALL, OPEN_ALL, SETTINGS } from './scriptActions'
import { useScriptReaderContext } from './contexts/ScriptReaderContext'

const ScriptReaderController = () => {
  const { options, dispatch } = useScriptReaderContext()

  return (
    <div className="fixed h-48 bg-white border rounded-md bottom-0 right-0">
      <div className="flex p-2 flex-col">
        <CollapseAll state={options} dispatch={dispatch} />
        <TextPosition type="actor" dispatch={dispatch} />
        <TextPosition type="info" dispatch={dispatch} />
      </div>
    </div>
  )
}

const TextPosition = ({ type, dispatch }) => {
  return (
    <div className="flex flex-col ">
      {type}
      <div className="flex flex-row gap-1">
        <button
          className="border border-black rounded p-1"
          onClick={() =>
            dispatch(
              SETTINGS({
                target: type,
                property: 'textPosition',
                value: 'text-left',
              })
            )
          }
        >
          left
        </button>
        <button
          className="border border-black rounded p-1"
          onClick={() =>
            dispatch(
              SETTINGS({
                target: type,
                property: 'textPosition',
                value: 'text-center',
              })
            )
          }
        >
          center
        </button>
        <button
          className="border border-black rounded p-1"
          onClick={() =>
            dispatch(
              SETTINGS({
                target: type,
                property: 'textPosition',
                value: 'text-right',
              })
            )
          }
        >
          right
        </button>
      </div>
    </div>
  )
}
const CollapseAll = ({ state, dispatch }) => {
  const { showAll } = state

  return (
    <>
      {showAll ? (
        <button
          className="border border-black rounded"
          onClick={() => dispatch(CLOSE_ALL())}
        >
          Close All
        </button>
      ) : (
        <button
          className="border border-black rounded"
          onClick={() => dispatch(OPEN_ALL())}
        >
          Open All
        </button>
      )}
    </>
  )
}
export default ScriptReaderController
