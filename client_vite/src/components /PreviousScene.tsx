import { useState } from "react";

import Modal from "./common/Modal";
import LineItem from "./ReaderV3/LineItem";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { RxTrackPrevious } from "react-icons/rx";
import { usePreviousScene } from "../store/scriptStore";
interface PreviousSceneProps {
  sceneId: number;
}

const PreviousScene = ({ sceneId }: PreviousSceneProps) => {
  const [initialId, setInitialId] = useState<number>(sceneId);
  const [showModal, setShowModal] = useState(false);
  const getPreviousScene = usePreviousScene();

  const previousScene = getPreviousScene(initialId);

  const handleClose = () => {
    setInitialId(sceneId);
    setShowModal(false);
  };

  return (
    <>
      <Modal
        title={previousScene?.id || "No Scene Found"}
        content={`${initialId}`}
        show={showModal}
        close={handleClose}
        onAccept={handleClose}
      >
        <button
          className="mr-2"
          type="button"
          onClick={() => setInitialId((prev) => prev - 1)}
        >
          <FaArrowLeft />
        </button>
        <button type="button" onClick={() => setInitialId((prev) => prev + 1)}>
          {<FaArrowRight />}
        </button>
        <div className="h-48 overflow-auto">
          {previousScene?.data.map((line) => (
            <LineItem key={line.id} line={line} />
          ))}
        </div>
      </Modal>
      <button
        className={`mx-4 ${previousScene ? "text-green-600" : "text-red-900"}`}
        type="button"
        onClick={() => {
          setShowModal(true);
        }}
      >
        <RxTrackPrevious size={24} />
      </button>
    </>
  );
};

export default PreviousScene;
