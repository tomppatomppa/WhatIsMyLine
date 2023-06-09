import { DropResult} from 'react-beautiful-dnd'
import { Reader } from 'src/components/ReaderV3/Reader'
import { getCurrentScript } from 'src/store/helpers'
import { useScriptStore} from 'src/store/scriptStore'


const ReaderPage = () => {
  const {scripts, activeScriptFilename ,reorderScenes} = useScriptStore((state) => state)

  const script = getCurrentScript(scripts, activeScriptFilename)

  const handleDragEnd = (result: DropResult) => {
   
    const { type, source, destination } = result
    if (!destination) return
    
    if(source.droppableId === destination.droppableId
       && source.index === destination.index) return

    if (type === 'droppable-category' && script) {
      reorderScenes(source.index, destination.index)  
    }

  }

  return (
    <div>
      {script && <Reader
        data={script.scenes}
        handleDragEnd={handleDragEnd}
      />}
    </div>
  )
}


export default ReaderPage
