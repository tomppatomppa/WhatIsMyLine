import { queryOptions } from "@tanstack/react-query";
import { getScript, getScriptMarkdown, getScripts } from "./scriptApi";
import { getUser } from "./userApi";

export const scriptsQueryOptions = () =>
  queryOptions({
    queryKey: ["scripts"],
    queryFn: () => getScripts(),
    staleTime: 1000 * 20,
  });
export const scriptsMarkdownQueryOptions = () =>
  queryOptions({
    queryKey: ["scripts-markdown"],
    queryFn: () => getScriptMarkdown(),
  });

export const scriptQueryOptions = (scriptId: string) =>
  queryOptions({
    queryKey: [`script-${scriptId}`, scriptId],
    queryFn: () => getScript(scriptId),
  });

export const userQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => getUser(),
    staleTime: 1000 * 60,
  });
