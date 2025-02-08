import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScriptById } from "../../../API/scriptApi";

export const useDeleteScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scriptId: string) => deleteScriptById(scriptId),
    onSuccess: (_: string, scriptId: string) => {
      queryClient.invalidateQueries({ queryKey: [`script-${scriptId}`] });
      queryClient.refetchQueries({ queryKey: ["scripts"] });
    },
  });
};
