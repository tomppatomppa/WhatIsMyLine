import { useState } from 'react'

import { usePreviousScene } from 'src/store/scriptStore'
import Modal from './common/Modal'
import LineItem from './ReaderV3/LineItem'

interface PreviousSceneProps {
  sceneId: string
}

const PreviousScene = ({ sceneId }: PreviousSceneProps) => {
  const [showModal, setShowModal] = useState(false)
  const getPreviousScene = usePreviousScene()
  const previousScene = getPreviousScene(sceneId)

  return (
    <>
      <Modal
        title={previousScene?.id || 'No Previous Scene Found'}
        content="Script"
        show={showModal}
        close={() => setShowModal(false)}
        onAccept={() => setShowModal(false)}
      >
        {previousScene?.data.map((line) => (
          <LineItem key={line.id} line={line} />
        ))}
      </Modal>
      <button
        className={`${previousScene ? 'text-green-600' : 'text-red-900'}`}
        type="button"
        onClick={() => {
          setShowModal(true)
        }}
      >
        ?
      </button>
    </>
  )
}

export default PreviousScene
