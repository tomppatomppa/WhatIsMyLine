import React, { useEffect, useState } from 'react'
import { HIGHLIGHT } from './scriptActions'
import { useScriptReaderContext } from './contexts/ScriptReaderContext'

const ScriptReaderScene = () => {
  const { script } = useScriptReaderContext()
  return (
    <div>
      <span className="font-bold">{script.title}</span>
      {script.scenes.map((scene) => (
        <SceneItem key={scene.id} scene={scene} />
      ))}
    </div>
  )
}

const SceneItem = ({ scene }) => {
  const { options } = useScriptReaderContext()
  const [show, setShow] = useState(false)

  const handleSetShow = () => {
    setShow(!show)
  }

  useEffect(() => {
    setShow(options.showAll)
  }, [options.showAll])

  return (
    <div className="p-2 my-2 max-w-3xl bg-stone-50 mx-auto shadow-sm border rounded-md border-gray-300 ´">
      <span onClick={handleSetShow} className="cursor-pointer">
        {scene.id} {scene.location} {scene.place}
      </span>
      {show &&
        scene.lines.map((line, index) => <LineItem key={index} {...line} />)}
    </div>
  )
}
const LineItem = ({ line, type, name }) => {
  const { options, dispatch } = useScriptReaderContext()
  const { highlight, settings } = options

  switch (type) {
    case 'INFO': {
      return (
        <div className={`${parseStyle(settings.info)} font-thin my-4`}>
          {line}
        </div>
      )
    }
    case 'ACTOR': {
      return (
        <div className={`${parseStyle(settings.actor)} cursor-pointer my-4`}>
          <p
            className={`${
              highlight.includes(name) && 'text-red-700'
            } font-bold`}
            onClick={() => dispatch(HIGHLIGHT(name))}
          >
            {name}
          </p>
          <p className={`${highlight.includes(name) && 'bg-green-200'}`}>
            {line}
          </p>
        </div>
      )
    }
    default:
      return null
  }
}

const parseStyle = (settings) => {
  const style = Object.values(settings).join(' ')
  return style
}

export default ScriptReaderScene
