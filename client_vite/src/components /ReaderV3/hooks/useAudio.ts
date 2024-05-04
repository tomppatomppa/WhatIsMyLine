import { useQuery } from "react-query";

import { Scene } from "../reader.types";
import { downloadSceneAudio } from "../../../API/googleApi";

const useAudio = (scene: Scene, scriptId: string, rootId: string) => {
  return useQuery(
    [`scene-${scene.id}-audio`],
    () =>
      downloadSceneAudio({
        rootId,
        scriptId,
        sceneId: scene.id,
        lines: scene.data,
      }),
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
      retry: false,
      enabled: !!rootId,
    }
  );
};

export default useAudio;
