import { useMutation, useQueryClient } from "react-query";
import { deleteScriptById } from "../../../API/scriptApi";

export const useDeleteScript = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteScriptById, {
    onSuccess: () => {
      queryClient.invalidateQueries("scripts");
    },
  });
};
