import { Link } from "@tanstack/react-router";
import React from "react";

interface ScriptListItemProps {
  id: string;
  text: string;
  children?: React.ReactNode;
  isActiveScript: boolean;
  slug: string;
  onClick: () => void;
}

const ScriptListItem = ({ ...props }: ScriptListItemProps) => {
  const { children, isActiveScript = false, text, ...rest } = props;

  const active = "text-gray-900 border-indigo-600 bg-primaryLight";

  const activeClass = isActiveScript ? active : "";
 
  return (
    <div className="flex flex-row justify-center items-center mr-2">
      <Link
        to="/scripts/$id"
        params={{ id: props.id }}
        {...rest}
        className={`${activeClass} cursor-pointer flex items-center w-full py-2 px-4 border-l hover:border-indigo-600 hover:text-gray-900 duration-150`}
      >
        {text}
      </Link>
      {children}
    </div>
  );
};
export default ScriptListItem;
