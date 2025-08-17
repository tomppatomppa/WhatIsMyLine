import { queryOptions } from "@tanstack/react-query";
import { getScript, getScriptMarkdown, getScripts } from "./scriptApi";
import { getUser } from "./userApi";
import { getFile } from "./uploadApi";

export const scriptsQueryOptions = () =>
  queryOptions({
    queryKey: ["scripts"],
    queryFn: () => getScripts(),
    staleTime: 1000 * 20,
  });

export const scriptsMarkdownQueryOptions = (id: number | undefined) =>
  queryOptions({
    enabled: !!id,
    queryKey: ["scripts-markdown", id],
    queryFn: () => getScriptMarkdown(id!),
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

  export const fileQueryOptions = (uuid: string) =>
  queryOptions({
    queryKey: ["file-" + uuid],
    queryFn: () => getFile(uuid),
    staleTime: 1000 * 60,
  });

