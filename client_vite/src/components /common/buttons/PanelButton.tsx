import Button from "../Button";

interface PanelButtonProps {
  className?: string;
  onClick: () => void;
  children?: React.ReactNode;
}
export const PanelButton = ({ children, ...props }: PanelButtonProps) => {
  return (
    <Button className="hover:bg-red-900" {...props}>
      {children}
    </Button>
  );
};
