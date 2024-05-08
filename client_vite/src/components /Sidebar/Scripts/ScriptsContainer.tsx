import { ScriptList } from "./ScriptList";
import EmptyScriptList from "./EmptyScriptList";
import { useQuery } from "react-query";

import { useState } from "react";
import { SearchBox } from "../../common/SearchBox";
import { scriptChanged } from "./utils";
import { fetchAllUserScripts } from "../../../API/scriptApi";
import {
  useSetActiveScriptId,
  useActiveScript,
} from "../../../store/scriptStore";
import { useDeleteScript } from "./useDeleteScript";
import { redirect, useMatch, useNavigate } from "react-router-dom";

interface ScriptContainerProps {
  children?: React.ReactNode;
  onScriptChange?: () => void;
}

const ScriptsContainer = ({
  children,
  onScriptChange,
}: ScriptContainerProps) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const setActiveScript = useSetActiveScriptId();
  const activeScript = useActiveScript();

  const { mutate: deleteScript } = useDeleteScript();

  const { data } = useQuery(["scripts"], fetchAllUserScripts, {
    suspense: true,
  });

  const filteredScripts =
    data?.filter(({ filename }) =>
      filename.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const handleSetActiveScript = (id: number) => {
    // if (scriptChanged(activeScript?.script_id, scriptId)) {
    //   onScriptChange && onScriptChange();
    // }
    
    navigate("/script/" + id)
   // setActiveScript(scriptId);
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
