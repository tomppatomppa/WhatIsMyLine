import {
  useMutation,
  useQueryClient,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
  useRouter,
} from "@tanstack/react-router";
import React from "react";
import { DropResult } from "react-beautiful-dnd";
import { scriptQueryOptions } from "../API/queryOptions";
import { updateScript } from "../API/scriptApi";
import { Reader } from "../components /ReaderV3/Reader";
import { Script } from "../components /ReaderV3/reader.types";
import { useScriptStore } from "../store/scriptStore";
import EmptyReaderView from "../views/EmptyReaderView";

export type Params = {
  id: string;
};

export const Route = createFileRoute("/_auth/scripts/$id")({
  loader: async ({ context: { queryClient }, params }) => {
    const { id } = params as Params;
    return queryClient.ensureQueryData(scriptQueryOptions(id));
  },
  errorComponent: PostErrorComponent,
  component: ScriptsPage,
});

export const useUpdateScript = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (script: Script) => updateScript(script),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["scripts", variables.script_id],
      });
      const previousTodo = queryClient.getQueryData([
        `scripts`,
        variables.script_id,
      ]);

      queryClient.setQueryData([`scripts`, variables.script_id], variables);

      return { previousTodo, variables };
    },
    onSettled: (script) => {
      queryClient.invalidateQueries({
        queryKey: [`scripts`, script.script_id],
      });
    },
  });
};

function ScriptsPage() {
  const { id } = Route.useParams<Params>();
  const { data: script } = useSuspenseQuery(scriptQueryOptions(id));
  const { reorderScenes, reorderLinesNew } = useScriptStore((state) => state);
  const { mutate } = useUpdateScript();

  const handleDragEnd = (result: DropResult) => {
    const { type, source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    if (type === "droppable-item" && script) {
      const newLines = reorderLinesNew(
        script,
        destination.droppableId,
        source.index,
        destination.index
      );
      mutate(newLines);

      //reorderLines(destination.droppableId, source.index, destination.index);
    } else {
      reorderScenes(source.index, destination.index);
    }
  };

  if (!script) {
    return <EmptyReaderView />;
  }

  return (
    <div>
      <Reader script={script} handleDragEnd={handleDragEnd} />
    </div>
  );
}
export class PostNotFoundError extends Error {}

export function PostErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter();
  if (error instanceof PostNotFoundError) {
    return <div>{error.message}</div>;
  }
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  React.useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div>
      <button
        onClick={() => {
          router.invalidate();
        }}
      >
        retry
      </button>
      <ErrorComponent error={error} />
    </div>
  );
}
