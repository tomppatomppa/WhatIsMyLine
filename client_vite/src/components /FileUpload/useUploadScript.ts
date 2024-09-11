import { useMutation, useQueryClient } from '@tanstack/react-query'
import { uploadfile } from "../../API/uploadApi";

export const useUploadScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadfile, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scripts'] });
    },
  });
};
