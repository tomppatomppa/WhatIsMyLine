import { useMutation, useQueryClient } from "react-query";
import { uploadfile } from "../../API/uploadApi";

export const useUploadScript = () => {
  const queryClient = useQueryClient();
  return useMutation(uploadfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("scripts");
    },
  });
};
