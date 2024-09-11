import { useQuery } from "@tanstack/react-query";
import { getScript } from "../../../API/scriptApi";

export const useScript = (id: number) => {
  return useQuery({
    queryKey: [`script-${id}`, id],
    queryFn: () => getScript(id),
  });
};
