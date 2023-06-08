
import { useState } from 'react'

import { DropResult } from 'react-beautiful-dnd'
import { Reader } from 'src/components/ReaderV3/Reader'
import { reorder } from 'src/components/ReaderV3/utils'
import { useAddScene,   useGetActiveScript} from 'src/store/scriptStore'


const ReaderPage = () => {
  const script = useGetActiveScript()
  
  const scenesConcatLines = script?.scenes.map((scene, sceneIndex) => {
    return {
      ...scene,
      name: scene.id,
      data: scene.data.map((line, index) => {
        return {
          ...line,
          name: line.name || '',
          lines: line.lines.join('\n'),
          id: `scene-${sceneIndex}:line-${index}`,
        }
      }),
    }
  })
  const [scenes =[], setScenes] = useState(scenesConcatLines)
 
  
  const addScene = useAddScene()
 

  
 
  const handleDragEnd = (result: DropResult) => {
    const { type, source, destination } = result
    if (!destination) return

    const sourceSceneId = source.droppableId
    const destinationSceneId = destination.droppableId
    

    if (type === 'droppable-item') {
      if (sourceSceneId === destinationSceneId) {
        const updatedOrder = reorder(
          scenes.find((scene) => scene.id === sourceSceneId)!.data,
          source.index,
          destination.index
        )
        const updatedCategories = scenes.map((scene) =>
          scene.id !== sourceSceneId ? scene : { ...scene, data: updatedOrder }
        )

        setScenes(updatedCategories)
      }
    }

    // Reordering categories
    if (type === 'droppable-category') {
      const updatedCategories = reorder(scenes, source.index, destination.index)

      setScenes(updatedCategories)
    }
  }

  const AddLine = (sceneIndex: number) => {
    
    const updatedScenes = [...scenes]

    updatedScenes[sceneIndex].data.unshift({
      type: 'ACTOR',
      name: '',
      id: `scene-${[sceneIndex]}:line-${scenes[sceneIndex].data.length}`,
      lines: 'new lines\new line\n',
    })

    setScenes(updatedScenes)
  }

  const DeleteLine = (sceneIndex: number, lineIndex: number) => {
    const updatedScenes = [...scenes]
    updatedScenes[sceneIndex].data.splice(lineIndex, 1)

    setScenes(updatedScenes)
  }
  console.log(script)
  return (
    <div>
      <button onClick={() => addScene({id: "name", data: []})}>Add Scene to Current</button>

      <Reader
        data={scenes}
        handleDragEnd={handleDragEnd}
        AddLine={AddLine}
        DeleteLine={DeleteLine}
      />
    </div>
  )
}

export default ReaderPage
