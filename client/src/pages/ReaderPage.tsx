import { useState } from 'react'
import { DropResult} from 'react-beautiful-dnd'
import { Reader } from 'src/components/ReaderV3/Reader'

import { getCurrentScript } from 'src/store/helpers'
import { useScriptStore} from 'src/store/scriptStore'

type OrderHistory = [number, number];
  

const ReaderPage = () => {
  const {scripts, activeScriptFilename , reorderScenes} = useScriptStore((state) => state)
  const script = getCurrentScript(scripts, activeScriptFilename)
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([])
  
  
  const handleDragEnd = (result: DropResult) => {
    const { type, source, destination } = result
    if (!destination) return
    
    if(source.droppableId === destination.droppableId
       && source.index === destination.index) return

    if (type === 'droppable-category' && script) {
      setOrderHistory([...orderHistory, [source.index, destination.index]]);
      reorderScenes(source.index, destination.index)  
    }
  }

  const handleReverseChanges = () => {
    if(orderHistory.length <= 0) return

    const history = [...orderHistory]
    const previousEdit = history.splice(-1)[0]

    reorderScenes(previousEdit[1], previousEdit[0])
    setOrderHistory(history)  
    
  }

  return (
    <div>
      {/* <button className='self-end bg-red-200 p-2' onClick={handleReverseChanges}>Undo</button> */}
      {script && <Reader
        data={script.scenes}
        handleDragEnd={handleDragEnd}
      />}
    </div>
  )
}


export default ReaderPage
