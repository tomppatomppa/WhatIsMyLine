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
import Button from "../components /common/Button";

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
  const { id } = Route.useParams();
  const router = useRouter();
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
      <div className="relative bg-gradient-to-r from-slate-50 to-gray-100 border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            onClick={() => router.navigate({ to: "/scripts-list" })}
            className="group relative inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-300/50 rounded-md hover:bg-white hover:border-slate-400/60 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-slate-50 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg
              className="relative w-4 h-4 mr-2.5 group-hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="relative">Back</span>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
            <div className="text-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent leading-tight">
                {script?.filename || "Script Reader"}
              </h1>
              <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-1 rounded-full"></div>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
          </div>
          <div className="w-20"></div> {/* Spacer for center alignment */}
        </div>

        {/* Subtle bottom glow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
      </div>

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
