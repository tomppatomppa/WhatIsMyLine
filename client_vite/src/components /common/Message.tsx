interface MessageProps {
  type?: "success" | "error" | "default";
  message: string;
  show: boolean;
}

const VARIANT = {
  default: "",
  success: "bg-green-200",
  error: "bg-red-200",
};
const Message = ({ show, type = "default", message }: MessageProps) => {
  return show ? <div className={`${VARIANT[type]}`}>{message}</div> : null;
};

export default Message;
