import { useContext } from "react";
import { ScenePanelContext } from "../../contexts/ScenePanelContext";

import EditPanel from "../Panels/EditPanel";
import RehearsePanel from "../Panels/RehearsePanel";
import { AutoScrollPanel } from "../Panels/AutoScrollPanel";

const PanelComponent = () => {
  const { panelView } = useContext(ScenePanelContext);
  switch (panelView) {
    case "rehearse":
      return <RehearsePanel />;
    case "edit":
      return <EditPanel />;
    case "scroll":
      return <AutoScrollPanel />;
    default:
      return null
  }
};

export default PanelComponent;
