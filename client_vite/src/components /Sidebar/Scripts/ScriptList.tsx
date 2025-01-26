import { Script } from "../../ReaderV3/reader.types";

import TrashButton from "../../common/buttons/TrashButton";
import ScriptListItem from "./ScriptListItem";

interface ScriptListProps {
  scripts: Script[];
  activeScriptId: string | undefined;
  setActiveScript: (scriptId: string) => void;
  deleteScript: (scriptId: string) => void;
}

export const ScriptList = ({
  scripts,
  activeScriptId,
  deleteScript,
}: ScriptListProps) => {
  return (
    <ul className="overflow-y-auto max-h-screen pt-6 text-gray-600">
      {scripts?.map(({ filename, script_id }, idx) => (
        <ScriptListItem
          key={script_id}
          id={`script-list-item-${idx}`}
          text={filename}
          slug={script_id}
          isActiveScript={activeScriptId === script_id}
          onClick={() => console.log(script_id)}
        >
          {/* <span className="flex-1 text-start">{filename}</span> */}
          <TrashButton onClick={() =>  deleteScript(script_id)} />
        </ScriptListItem>
      ))}
    </ul>
  );
};
