import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScript } from "../../../../../API/scriptApi";
import { Script } from "../../../reader.types";

export const useUpdateScript = (script: Script) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => updateScript(script),
    onSuccess: () => {
      client.invalidateQueries();
    },
  });
};
