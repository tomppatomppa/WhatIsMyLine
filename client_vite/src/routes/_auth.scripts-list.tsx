import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FcReadingEbook } from "react-icons/fc";
import { useRouter } from "@tanstack/react-router";

import { fileQueryOptions, scriptsQueryOptions } from "../API/queryOptions";
import Button from "../components /common/Button";
import { PdfPreview } from "./_auth.user.upload";

export const Route = createFileRoute("/_auth/scripts-list")({
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(scriptsQueryOptions());
  },
  component: Component,
});

function Component() {
  const { data, isLoading, isError } = useSuspenseQuery(scriptsQueryOptions());
  const router = useRouter();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [view, setView] = useState(null);
  if (isLoading) return <div className="p-4">Loading scripts...</div>;
  if (isError)
    return <div className="p-4 text-red-500">Error loading scripts</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {view && <ViewOriginalPdf uuid={view} onClose={() => setView(null)} />}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Your Scripts
      </h1>

      <ul className="space-y-4">
        {data
          .slice()
          .reverse()
          .map((script: any) => (
            <li
              key={script.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-5 cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === script.id ? null : script.id)
              }
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <span className="font-medium text-lg text-gray-800">
                  {script.filename || "Untitled Script"}
                </span>
                <FcReadingEbook size={24} className="text-gray-500" />
              </div>

              {/* Expandable Content */}
              {expandedId === script.id && (
                <div className="mt-4 border-t border-gray-200 pt-4 space-y-3 text-gray-700">
                  <p className="text-sm leading-relaxed">{script.markdown}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Button
                      onClick={() =>
                        router.navigate({ to: `/scripts/${script.id}` })
                      }
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </Button>
                    <Button
                      onClick={() => setView(script.script_id)}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                       PDF
                    </Button>

                    <Button
                      onClick={() =>
                        router.navigate({ to: `/markdown-edit/${script.id}` })
                      }
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Button>

                    <Button
                      onClick={() => alert("Delete action")}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

const ViewOriginalPdf = ({ uuid, onClose }: any) => {
  const { data: pdfBlob } = useQuery(fileQueryOptions(uuid));
  const pdfUrl = pdfBlob ? URL.createObjectURL(pdfBlob) : null;

  return <PdfPreview selectedPdf={pdfUrl} setSelectedPdf={onClose} />;
};
