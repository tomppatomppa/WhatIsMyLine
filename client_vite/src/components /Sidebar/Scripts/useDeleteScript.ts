import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteScriptById } from "../../../API/scriptApi";

export const useDeleteScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScriptById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
  });
};
