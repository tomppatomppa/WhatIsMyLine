import { useQuery } from "@tanstack/react-query";

import { Scene } from "../reader.types";
import { downloadSceneAudio } from "../../../API/googleApi";

const useAudio = (scene: Scene, scriptId: string, rootId: string) => {
  return useQuery({
    queryKey: [`scene-${scene.id}-audio`],
    queryFn: () =>
      downloadSceneAudio({
        rootId,
        scriptId,
        sceneId: scene.id,
        lines: scene.data,
      }),
    staleTime: 60 * 1000,

    placeholderData: true,
    retry: false,
    enabled: !!rootId,
  });
};

export default useAudio;
