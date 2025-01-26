import { useSuspenseQuery } from "@tanstack/react-query";
import EmptyScriptList from "./EmptyScriptList";
import { ScriptList } from "./ScriptList";

import { useState } from "react";
import { fetchAllUserScripts } from "../../../API/scriptApi";
import {
  useActiveScript,
} from "../../../store/scriptStore";
import { SearchBox } from "../../common/SearchBox";
import { useDeleteScript } from "./useDeleteScript";
import { scriptChanged } from "./utils";

interface ScriptContainerProps {
  children?: React.ReactNode;
  onScriptChange?: () => void;
}

const ScriptsContainer = ({
  children,
  onScriptChange,
}: ScriptContainerProps) => {
  const [search, setSearch] = useState("");

  //const setActiveScript = useSetActiveScriptId();
  const activeScript = useActiveScript();

  const { mutate: deleteScript } = useDeleteScript();

  const { data } = useSuspenseQuery({
    queryKey: ["scripts"],
    queryFn: fetchAllUserScripts,
  });

  const filteredScripts =
    data?.filter(({ filename }: any) =>
      filename.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const handleSetActiveScript = (id: string) => {
    
    if (scriptChanged(activeScript?.script_id, id)) {
      onScriptChange && onScriptChange();
    }

    //setActiveScript(id);
  };

  const scriptProps = {
    scripts: filteredScripts,
    activeScriptId: activeScript?.script_id,
    setActiveScript: handleSetActiveScript,
    deleteScript: deleteScript,
  };

  return (
    <div className={`flex flex-col h-full w-full gap-4`}>
      {children}
      <div className="px-4 md:px-8">
        <SearchBox setSearch={setSearch} />
      </div>
      {scriptProps.scripts ? (
        <ScriptList {...scriptProps} />
      ) : (
        <EmptyScriptList />
      )}
    </div>
  );
};

export default ScriptsContainer;
