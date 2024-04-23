import { AiOutlineDelete } from "react-icons/ai";

interface TrashButtonProps {
  onClick: () => void;
}
const TrashButton = ({ onClick }: TrashButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-8 flex-none flex items-center hover:bg-gray-200 justify-center h-8 rounded-md"
    >
      <AiOutlineDelete color="red" />
      <span className="hidden">Delete</span>
    </button>
  );
};

export default TrashButton;
