import { useQuery } from "react-query";
import { getScript } from "../../../API/scriptApi";

export const useScript = (id: number) => {
  return useQuery([`script-${id}`, id], () => getScript(id));
};
