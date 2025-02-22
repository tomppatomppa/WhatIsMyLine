import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadfile, uploadfileV4 } from "../../API/uploadApi";

export const useUploadScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripts"] });
    },
  });
};

export const useUploadScriptV4 = () => {
  return useMutation({
    mutationFn: uploadfileV4,
    onSuccess: () => {
      //  queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
};
