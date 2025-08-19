import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  ErrorComponent,
  Link,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { scriptsMarkdownQueryOptions } from "../API/queryOptions";

import {
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  searchPlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  useCellValue,
  usePublisher,
  currentBlockType$,
  Select,
  convertSelectionToNode$,
  rootEditor$,
  BoldItalicUnderlineToggles,
  MDXEditorMethods,
  DiffSourceToggleWrapper,
  UndoRedo,
} from "@mdxeditor/editor";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingNode,
} from "@lexical/rich-text";
import "@mdxeditor/editor/style.css";
import { useEffect, useState } from "react";

import {
  $createParagraphNode,
  $getRoot,
  $isParagraphNode,
  $isTextNode,
  ElementNode,
} from "lexical";
import React from "react";
import { createScriptMarkdown } from "../API/scriptApi";

// const SimpleSearchUI = () => {
//   const { search, setSearch, next, prev, total, cursor } = useEditorSearch();

//   return (
//     <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//       <input
//         type="text"
//         value={search ?? ""}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search document..."
//       />
//       <button onClick={prev} disabled={total === 0}>
//         &lt; Prev
//       </button>
//       <span>{total > 0 ? `${cursor} / ${total}` : "0 / 0"}</span>
//       <button onClick={next} disabled={total === 0}>
//         Next &gt;
//       </button>
//     </div>
//   );
// };

type ScriptSearch = {
  redirect?: string;
};
export const Route = createFileRoute("/markdown-edit/{-$id}")({
  validateSearch: (search: Record<string, unknown>): ScriptSearch => {
    return {
      redirect: (search?.redirect as string) ?? "",
    };
  },
  component: RouteComponent,
  errorComponent:  ErrorComponent
 
  
});

function RouteComponent() {
  const query = useQueryClient();
  const router = useRouter();
  const { search } = useLocation();
  const { id } = Route.useParams();

  const { data, isLoading, isError, error } = useQuery(scriptsMarkdownQueryOptions(Number(id)));

  const { mutate } = useMutation({
    mutationFn: createScriptMarkdown,
    onSuccess: async (data) => {
      await query.invalidateQueries({ queryKey: ["scripts"] });
      if (search.redirect) {

        router.navigate({ to: decodeURIComponent(search.redirect) });
      } else {
        router.navigate({ to: `/markdown-edit/${data.id}` });
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  const defaults = (): { markdown: string; filename: string } => {
    if (!id || !data?.markdown) {
      return {
        markdown: DEFAULT,
        filename: "default-" + Date.now().toString(),
      };
    }

    return {
      markdown: data.markdown,
      filename: data.filename ?? "default-" + Date.now().toString(),
    };
  };

  const { markdown, filename } = defaults();
  
  if(isError)  {
     return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-900 text-sm">Error {error.message}</div>
      </div>
    );
  }
  
  return (
    <Markdown
      markdown={markdown}
      initialFilename={filename}
      onSave={({ markdown, filename }) =>
        mutate({ id: Number(id), markdown: markdown, filename: filename })
      }
    />
  );
}

interface MarkdownProps {
  markdown: string;
  initialFilename: string;
  onSave: (data: { markdown: string; filename: string }) => void;
}
export const Markdown = ({
  markdown,
  initialFilename,
  onSave,
}: MarkdownProps) => {
  const ref = React.useRef<MDXEditorMethods>(null);
  const [filename, setFilename] = useState(initialFilename);
  const [width] = useState(700);
  
  function handleMarkdownChange(): void {
    console.log("Function not implemented.");
  }

  function handleSave(): void {
    const current = ref.current?.getMarkdown();
    if (!current) return;
    console.log("Saving markdown:", current);
    // 🔹 Replace this with API call to save the content
    //   alert("Markdown saved! (check console for content)");
    onSave({ markdown: current, filename: filename });
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="flex items-center justify-between px-2 md:px-6 py-2 md:py-4 border-b bg-white shadow-sm sticky top-0 z-30">
        <Link to="/" className="text-xl font-light text-slate-800">
         Home
        </Link>
        <div className="flex items-center gap-3">
          {/* Filename input */}
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="Enter filename"
            className="px-3 w-full py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
          {/* Width controls */}
          {/* <button
            onClick={() =>
              setWidth((prev) => (prev + 50 > 1000 ? prev : prev + 50))
            }
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            +
          </button>
          <button
            onClick={() =>
              setWidth((prev) => (prev - 50 < 400 ? prev : prev - 50))
            }
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            -
          </button> */}

          {/* Save button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-700 transition"
          >
            Save
          </button>
        </div>
      </header>

      {/* Main Editor Area */}
      <main className="flex-1 overflow-y-auto md:px-6 ">
        <div
          style={
            {
              "--text-width": `${width}px`,
            } as React.CSSProperties
          }
          className="mx-auto max-w-4xl border border-gray-200 rounded-lg bg-white shadow-sm"
        >
          <MDXEditor
            ref={ref}
            contentEditableClassName="prose max-w-none px-6 py-8 focus:outline-none"
            markdown={markdown}
            onChange={handleMarkdownChange}
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              thematicBreakPlugin(),
              markdownShortcutPlugin(),
              searchPlugin(),

              codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
              codeMirrorPlugin({
                codeBlockLanguages: {
                  txt: "Plain Text",
                  js: "JavaScript",
                  css: "CSS",
                  html: "HTML",
                  python: "Python",
                  json: "JSON",
                },
              }),

              diffSourcePlugin({ viewMode: "rich-text" }),
              frontmatterPlugin(),
              imagePlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              tablePlugin(),

              // Toolbar stays exactly how you defined it
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <BoldItalicUnderlineToggles />
                    <CustomBlockTypeSelect />
                    <DiffSourceToggleWrapper>
                      <UndoRedo />
                    </DiffSourceToggleWrapper>
                    <Test options={{ auto: false }} />
                  </>
                ),
                // This makes it sticky
                toolbarClassName:
                  "sticky top-0 z-20 bg-white border-b shadow-sm px-4",
              }),
            ]}
          />
        </div>
      </main>
    </div>
  );
};

const Test = ({ options }: { options: { auto: boolean } }) => {
  const editor = useCellValue(rootEditor$);
  const convertSelectionToNode = usePublisher(convertSelectionToNode$);
  
  useEffect(() => {
    if (!editor) return;
    editor.registerNodeTransform(HeadingNode, (node) => {
      if (node.getTag() === "h1") {
        const children = node.getChildren();

        children.forEach((child) => {
          if ($isTextNode(child) && !child.hasFormat("bold")) {
            child.toggleFormat("bold");
          }
        });
      }
      if (node.getTag() === "h2") {
        const children = node.getChildren();
        children.forEach((child) => {
          if ($isTextNode(child) && child.hasFormat("bold")) {
            child.toggleFormat("highlight");
          }
        });
      }
    });
    // Listen for editor updates
    const unsubscribe = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const children = root.getChildren();
        children.forEach((node, i, children) => {
          if (options.auto === false) return;
          if ($isParagraphNode(node)) {
            const prev = i > 0 ? children[i - 1] : null;

            if (prev && $isParagraphNode(prev)) {
              const prevText = prev.getTextContent().trim();

              if (prevText.length === 0) {
                // ✅ Do something when previous is an empty paragraph
                console.log("Previous paragraph is empty!");
                convertSelectionToNode(
                  () =>
                    $createHeadingNode("h2" as any) as unknown as ElementNode
                );
              }
            }
            if ($isHeadingNode(prev)) {
              const tag = prev.getTag(); // returns "h1", "h2", "h3", etc.

              if (tag === "h1" || tag === "h3" || tag === "h4") {
                console.log(`Previous was ${tag}, converting current to ACTOR`);
                if (!prev.getTextContent()) {
                  return;
                }
                convertSelectionToNode(
                  () => $createHeadingNode("h2") as unknown as ElementNode
                );
              }
              if (tag === "h2") {
                console.log("HASD");
                //  convertSelectionToNode(
                //    () => $createParagraphNode() as unknown as ElementNode
                //  );
              }
            }

            // console.log("Current paragraph:", node.getTextContent());
          }

          // const matches: { headingText: string; start: any; end: any }[] = [];
          if ($isHeadingNode(node) && node.getTag() === "h2") {
            const text = node.getTextContent();
            if (text.includes("TIKA")) {
              // Use 0 offsets since we're scanning the full text of the node
              // const generator = rangeSearchScan("TIKA", {
              //   allText: text,
              //   offsetIndex: [0, 23],
              //   nodeIndex: [],
              // });
              //  for (const range of generator.next()) {
              //     console.log(`Found range: start=${range.start}, end=${range.end}`);
              //   }
            }
          }
        });

        // console.log("Matches in h2:", matches);
      });
    });

    return () => unsubscribe();
  }, [editor, options]);

  return null;
};

export const CustomBlockTypeSelect = () => {
  // Read the current block type from the state cell
  //  const applyBlockType = usePublisher(applyBlockType$);
  const currentBlockType = useCellValue(currentBlockType$);
  const convertSelectionToNode = usePublisher(convertSelectionToNode$);

  const applyBlockType = (blockType: string) => {
    switch (blockType) {
      case "quote":
        convertSelectionToNode(
          () => $createQuoteNode() as unknown as ElementNode
        );
        break;
      case "paragraph":
        convertSelectionToNode(() => $createParagraphNode());
        break;
      case "":
        break;
      default:
        if (blockType.startsWith("h")) {
          convertSelectionToNode(
            () => $createHeadingNode(blockType as any) as unknown as ElementNode
          );
        } else {
          throw new Error(`Unknown block type: ${blockType}`);
        }
    }
  };
  return (
    <>
      <div style={{ marginLeft: "auto" }}>
        <Select
          value={currentBlockType}
          items={[
            { label: "SCENE", value: "h1" },
            { label: "ACTOR", value: "h2" },
            { label: "DIALOG", value: "paragraph" },
            { label: "EXT", value: "h3" },
            { label: "INT", value: "h4" },
          ]}
          onChange={(value) =>
            value !== currentBlockType && applyBlockType(value)
          }
          triggerTitle={"Line type"}
          placeholder={"SCENE"}
        />
      </div>
    </>
  );
};

const DEFAULT = `# **16101 INT. VÅNING 5 1/2 16101**

&#x20;   *Tika har ett ihoprullat papper i handen (bild på*

&#x20;   *Dammråttan). Hon söker under bordet, runt soffan. Märker*

&#x20;   *BUU-klubbisen. (Hissen är inte i användning)*



## &#x20;                TIKA

### &#x20;            (till KAM)

&#x20;            Hej BUU-klubbis! Vet du, Malins och

&#x20;            barnens spökbana blev mycket mera

&#x20;            spännande än nån kunde ha tänkt sig!

&#x20;            Malin berättade att hon såg

&#x20;            Dammråttan i källaren, alltså

&#x20;            faktiskt SÅG den! Ser du, här är en

&#x20;            bild som hon ritade åt oss...

&#x20;   Tika visar bilden hon har i handen.

## &#x20;                TIKA

&#x20;            *(till KAM)*

&#x20;            Jag tycker den ser lite skrämmande ut

&#x20;            men den lyckades faktiskt skrämma

&#x20;            bort Klösus från tornet! Så jag

&#x20;            tänkte att jag ska försöka locka ut

&#x20;            den och bli vän med den! Tror du jag

&#x20;            lyckas med det? Allra först måst jag

&#x20;            hitta WC-papper...

&#x20;   *Tika går till skåpen, mumlar för sig själv.*

## &#x20;                TIKA

&#x20;            Här måst ju finnas någo...

&#x20;   Tika öppnar första skåpet. Ut faller en stor hög av

&#x20;   mjukisdjur.`;
// const sampleMarkdown = `# BUU-klubben 2023
// Date: 2023-09-01

// \`\`\`txt
// 16101 INT. VÅNING 5 1/2 16101
//     Tika har ett ihoprullat papper i handen (bild på
//     Dammråttan). Hon söker under bordet, runt soffan. Märker
//     BUU-klubbisen. (Hissen är inte i användning)
//                  TIKA
//              (till KAM)
//              Hej BUU-klubbis! Vet du, Malins och
//              barnens spökbana blev mycket mera
//              spännande än nån kunde ha tänkt sig!
//              Malin berättade att hon såg
//              Dammråttan i källaren, alltså
//              faktiskt SÅG den! Ser du, här är en
//              bild som hon ritade åt oss...
//     Tika visar bilden hon har i handen.
//                  TIKA
//              (till KAM)
//              Jag tycker den ser lite skrämmande ut
//              men den lyckades faktiskt skrämma
//              bort Klösus från tornet! Så jag
//              tänkte att jag ska försöka locka ut
//              den och bli vän med den! Tror du jag
//              lyckas med det? Allra först måst jag
//              hitta WC-papper...
//     Tika går till skåpen, mumlar för sig själv.
//                  TIKA
//              Här måst ju finnas någo...
//     Tika öppnar första skåpet. Ut faller en stor hög av
//     mjukisdjur.
//                  TIKA
// \`\`\``;

// const MDXEditorWithHighlighting = () => {
//   const [markdown, setMarkdown] = useState(sampleMarkdown);
//   const [highlightedWord, setHighlightedWord] = useState("");
//   const [wordCount, setWordCount] = useState(0);
//   const editorRef = useRef(null);

//   const handleMarkdownChange = useCallback((newMarkdown) => {
//     setMarkdown(newMarkdown);
//   }, []);

//   const highlightWord = useCallback(
//     (word) => {
//       if (!word || word.length < 2) return;

//       const cleanWord = word.replace(/[^\w\såäöÅÄÖ]/g, "").toLowerCase();
//       setHighlightedWord(cleanWord);

//       // Count occurrences
//       const regex = new RegExp(`\\b${cleanWord}\\b`, "gi");
//       const matches = markdown.match(regex) || [];
//       setWordCount(matches.length);
//     },
//     [markdown]
//   );

//   const clearHighlight = useCallback(() => {
//     setHighlightedWord("");
//     setWordCount(0);
//   }, []);

//   const getWordAtPosition = (text, position) => {
//     const words = text.split(/\s+/);
//     let currentPos = 0;

//     for (const word of words) {
//       const wordStart = currentPos;
//       const wordEnd = currentPos + word.length;

//       if (position >= wordStart && position <= wordEnd) {
//         return word.replace(/[^\w\såäöÅÄÖ]/g, "");
//       }

//       currentPos = wordEnd + 1; // +1 for space
//     }

//     return "";
//   };

//   const handleEditorClick = useCallback(
//     (event) => {
//       // Get the clicked element
//       const target = event.target;

//       if (target && target.textContent) {
//         // Get word from clicked text
//         const text = target.textContent;
//         const rect = target.getBoundingClientRect();
//         const clickX = event.clientX - rect.left;

//         // Rough estimation of character position
//         const charWidth = rect.width / text.length;
//         const charPosition = Math.floor(clickX / charWidth);

//         const word = getWordAtPosition(text, charPosition);

//         if (word && word.length > 1) {
//           highlightWord(word);
//         }
//       }
//     },
//     [highlightWord]
//   );

//   return (
//     <div className="mdx-highlight-container">
//       <style jsx>{`
//         .mdx-highlight-container {
//           font-family: "Inter", system-ui, sans-serif;
//           max-width: 1000px;
//           margin: 0 auto;
//           padding: 20px;
//         }

//         .highlight-controls {
//           display: flex;
//           gap: 12px;
//           align-items: center;
//           padding: 12px 16px;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           border-radius: 8px;
//           margin-bottom: 16px;
//           font-size: 14px;
//         }

//         .highlight-info {
//           flex: 1;
//           color: #64748b;
//         }

//         .highlighted-word {
//           background: #fef3c7;
//           color: #92400e;
//           padding: 2px 6px;
//           border-radius: 4px;
//           font-weight: 600;
//         }

//         .clear-btn {
//           background: #ef4444;
//           color: white;
//           border: none;
//           padding: 6px 12px;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 12px;
//         }

//         .clear-btn:hover {
//           background: #dc2626;
//         }

//         .word-input {
//           padding: 6px 12px;
//           border: 1px solid #d1d5db;
//           border-radius: 6px;
//           font-size: 14px;
//           width: 150px;
//         }

//         .highlight-btn {
//           background: #3b82f6;
//           color: white;
//           border: none;
//           padding: 6px 12px;
//           border-radius: 6px;
//           cursor: pointer;
//           font-size: 12px;
//         }

//         .highlight-btn:hover {
//           background: #2563eb;
//         }

//         /* Hide line numbers */
//         .mdx-highlight-container :global(.cm-lineNumbers),
//         .mdx-highlight-container :global(.cm-gutters) {
//           display: none !important;
//         }

//         /* Style code blocks */
//         .mdx-highlight-container :global(.cm-editor) {
//           font-family: "SF Mono", "Monaco", monospace !important;
//           font-size: 14px !important;
//           line-height: 1.7 !important;
//           padding: 24px !important;
//           background: #fafbfc !important;
//           border: 1px solid #e5e7eb !important;
//           border-radius: 12px !important;
//           cursor: text !important;
//         }

//         .mdx-highlight-container :global(.cm-content) {
//           padding: 0 !important;
//           min-height: 300px !important;
//         }

//         /* Highlight matching words */
//         .mdx-highlight-container :global(.highlight-word) {
//           background-color: #fef3c7 !important;
//           color: #92400e !important;
//           border-radius: 3px !important;
//           padding: 1px 2px !important;
//           font-weight: 600 !important;
//           box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
//         }

//         /* Click areas */
//         .mdx-highlight-container :global(.cm-line) {
//           cursor: pointer !important;
//         }

//         /* Rich text styling */
//         .mdx-highlight-container :global(.mdxeditor-rich-text-editor) {
//           padding: 24px !important;
//           line-height: 1.8 !important;
//         }

//         .mdx-highlight-container :global(.mdxeditor-rich-text-editor h1) {
//           font-size: 2.2em !important;
//           color: #1f2937 !important;
//           margin-bottom: 0.8em !important;
//           border-bottom: 2px solid #e5e7eb !important;
//           padding-bottom: 0.3em !important;
//         }

//         .mdx-highlight-container :global(.mdxeditor-rich-text-editor pre) {
//           background: linear-gradient(
//             135deg,
//             #f8f9fa 0%,
//             #e9ecef 100%
//           ) !important;
//           border: 1px solid #dee2e6 !important;
//           border-radius: 16px !important;
//           padding: 32px !important;
//           font-family: "SF Mono", "Monaco", monospace !important;
//           font-size: 13px !important;
//           line-height: 1.8 !important;
//           color: #2d3748 !important;
//           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
//           margin: 1.5em 0 !important;
//           white-space: pre-wrap !important;
//           cursor: pointer !important;
//         }
//       `}</style>

//       <div className="highlight-controls">
//         <input
//           type="text"
//           placeholder="Type word to highlight..."
//           className="word-input"
//           onChange={(e) => highlightWord(e.target.value)}
//           value={highlightedWord}
//         />
//         <button
//           className="highlight-btn"
//           onClick={() => highlightWord(highlightedWord)}
//         >
//           Highlight
//         </button>
//         {highlightedWord && (
//           <>
//             <div className="highlight-info">
//               Highlighting:{" "}
//               <span className="highlighted-word">{highlightedWord}</span>(
//               {wordCount} occurrences)
//             </div>
//             <button className="clear-btn" onClick={clearHighlight}>
//               Clear
//             </button>
//           </>
//         )}
//         {!highlightedWord && (
//           <div className="highlight-info">
//             Click on any word in the editor to highlight all occurrences
//           </div>
//         )}
//       </div>

//       <div onClick={handleEditorClick} onDoubleClick={handleEditorClick}>
//         <MDXEditor
//           ref={editorRef}
//           markdown={markdown}
//           onChange={handleMarkdownChange}
//           plugins={[
//             headingsPlugin(),
//             listsPlugin(),
//             quotePlugin(),
//             thematicBreakPlugin(),
//             markdownShortcutPlugin(),
//             codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
//             codeMirrorPlugin({
//               codeBlockLanguages: {
//                 txt: "Script",
//                 javascript: "JavaScript",
//                 python: "Python",
//               },
//             }),
//             diffSourcePlugin({ viewMode: "rich-text" }),
//             toolbarPlugin({
//               toolbarContents: () => (
//                 <DiffSourceToggleWrapper>
//                   <UndoRedo />
//                   <BoldItalicUnderlineToggles />
//                   <BlockTypeSelect />
//                   <InsertCodeBlock />
//                 </DiffSourceToggleWrapper>
//               ),
//             }),
//           ]}
//         />
//       </div>

//       {/* Live word highlighting with CSS */}
//       {highlightedWord && (
//         <style jsx global>{`
//           .mdx-highlight-container .cm-content *,
//           .mdx-highlight-container .mdxeditor-rich-text-editor * {
//             background: ${highlightedWord
//               ? `
//               linear-gradient(transparent, transparent),
//               ${
//                 markdown.split(new RegExp(`\\\\b${highlightedWord}\\\\b`, "gi"))
//                   .length > 1
//                   ? `repeating-linear-gradient(
//                   0deg,
//                   transparent,
//                   transparent 1em,
//                   #fef3c7 1em,
//                   #fef3c7 1.2em
//                 )`
//                   : "transparent"
//               }
//             `
//               : "transparent"} !important;
//           }
//         `}</style>
//       )}

//       <script
//         dangerouslySetInnerHTML={{
//           __html: `
//           // Enhanced click detection for word highlighting
//           document.addEventListener('DOMContentLoaded', function() {
//             const container = document.querySelector('.mdx-highlight-container');
//             if (container) {
//               container.addEventListener('click', function(e) {
//                 const target = e.target;
//                 if (target && target.textContent) {
//                   const selection = window.getSelection();
//                   if (selection.rangeCount > 0) {
//                     const range = selection.getRangeAt(0);
//                     const word = selection.toString().trim();

//                     if (word && word.length > 1 && /^[a-zA-ZåäöÅÄÖ]+$/.test(word)) {
//                       // Trigger highlight via custom event
//                       const event = new CustomEvent('highlightWord', {
//                         detail: { word: word.toLowerCase() }
//                       });
//                       container.dispatchEvent(event);
//                     }
//                   }
//                 }
//               });
//             }
//           });
//         `,
//         }}
//       />
//     </div>
//   );
// };

// // Alternative: More advanced version with CodeMirror extensions
// const AdvancedMDXHighlighter = () => {
//   const [markdown, setMarkdown] = useState(sampleMarkdown);
//   const [highlightedWord, setHighlightedWord] = useState("");
//   const [highlights, setHighlights] = useState([]);

//   const processHighlights = useCallback(
//     (word) => {
//       if (!word || word.length < 2) {
//         setHighlights([]);
//         return;
//       }

//       const regex = new RegExp(`\\\\b${word}\\\\b`, "gi");
//       const matches = [];
//       let match;

//       while ((match = regex.exec(markdown)) !== null) {
//         matches.push({
//           from: match.index,
//           to: match.index + match[0].length,
//           word: match[0],
//         });
//       }

//       setHighlights(matches);
//     },
//     [markdown]
//   );

//   const handleWordClick = (word) => {
//     const cleanWord = word.replace(/[^\\w\\såäöÅÄÖ]/g, "").toLowerCase();
//     setHighlightedWord(cleanWord);
//     processHighlights(cleanWord);
//   };

//   const renderHighlightedContent = (content) => {
//     if (!highlightedWord || !content) return content;

//     const regex = new RegExp(`\\\\b(${highlightedWord})\\\\b`, "gi");
//     return content.replace(regex, '<mark class="highlight-match">$1</mark>');
//   };

//   return (
//     <div className="advanced-highlight-container">
//       <style jsx>{`
//         .advanced-highlight-container {
//           max-width: 1000px;
//           margin: 0 auto;
//           padding: 20px;
//         }

//         .highlight-stats {
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//           padding: 16px 20px;
//           border-radius: 12px;
//           margin-bottom: 20px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .highlight-info {
//           font-weight: 600;
//         }

//         .word-counter {
//           background: rgba(255, 255, 255, 0.2);
//           padding: 8px 16px;
//           border-radius: 20px;
//           font-size: 14px;
//         }

//         .clear-highlight {
//           background: rgba(255, 255, 255, 0.2);
//           border: none;
//           color: white;
//           padding: 8px 16px;
//           border-radius: 20px;
//           cursor: pointer;
//           font-size: 14px;
//         }

//         .clear-highlight:hover {
//           background: rgba(255, 255, 255, 0.3);
//         }

//         /* Hide line numbers and gutters */
//         .advanced-highlight-container :global(.cm-lineNumbers),
//         .advanced-highlight-container :global(.cm-gutters) {
//           display: none !important;
//         }

//         /* Code editor styling */
//         .advanced-highlight-container :global(.cm-editor) {
//           font-family: "JetBrains Mono", "SF Mono", monospace !important;
//           font-size: 14px !important;
//           line-height: 1.8 !important;
//           padding: 24px !important;
//           background: #fafbfc !important;
//           border: 2px solid #e5e7eb !important;
//           border-radius: 16px !important;
//           cursor: pointer !important;
//         }

//         .advanced-highlight-container :global(.cm-content) {
//           padding: 0 !important;
//           min-height: 400px !important;
//         }

//         /* Rich text view */
//         .advanced-highlight-container :global(.mdxeditor-rich-text-editor) {
//           padding: 32px !important;
//           line-height: 1.9 !important;
//           cursor: pointer !important;
//         }

//         .advanced-highlight-container :global(.mdxeditor-rich-text-editor h1) {
//           font-size: 2.5em !important;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           margin-bottom: 0.8em !important;
//           font-weight: 800 !important;
//         }

//         .advanced-highlight-container :global(.mdxeditor-rich-text-editor pre) {
//           background: linear-gradient(
//             135deg,
//             #f8f9fa 0%,
//             #e9ecef 100%
//           ) !important;
//           border: 2px solid #dee2e6 !important;
//           border-radius: 20px !important;
//           padding: 40px !important;
//           font-family: "JetBrains Mono", monospace !important;
//           font-size: 13px !important;
//           line-height: 1.9 !important;
//           color: #2d3748 !important;
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
//           margin: 2em 0 !important;
//           cursor: pointer !important;
//         }

//         /* Global highlight styling */
//         .advanced-highlight-container :global(.highlight-match) {
//           background: linear-gradient(
//             135deg,
//             #fef3c7 0%,
//             #fde68a 100%
//           ) !important;
//           color: #92400e !important;
//           padding: 2px 4px !important;
//           border-radius: 4px !important;
//           font-weight: 700 !important;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
//           border: 1px solid #f59e0b !important;
//         }
//       `}</style>

//       {highlightedWord && (
//         <div className="highlight-stats">
//           <div className="highlight-info">
//             Highlighting: "{highlightedWord}"
//           </div>
//           <div className="word-counter">{highlights.length} occurrences</div>
//           <button
//             className="clear-highlight"
//             onClick={() => handleWordClick("")}
//           >
//             Clear
//           </button>
//         </div>
//       )}

//       <div
//         onClick={handleEditorClick}
//         onMouseUp={(e) => {
//           // Handle text selection
//           const selection = window.getSelection();
//           const selectedText = selection.toString().trim();

//           if (
//             selectedText &&
//             selectedText.length > 1 &&
//             /^[a-zA-ZåäöÅÄÖ]+$/.test(selectedText)
//           ) {
//             handleWordClick(selectedText);
//           }
//         }}
//       >
//         <MDXEditor
//           markdown={markdown}
//           onChange={handleMarkdownChange}
//           plugins={[
//             headingsPlugin(),
//             listsPlugin(),
//             quotePlugin(),
//             thematicBreakPlugin(),
//             markdownShortcutPlugin(),
//             codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
//             codeMirrorPlugin({
//               codeBlockLanguages: {
//                 txt: "Script",
//                 javascript: "JavaScript",
//                 python: "Python",
//               },
//             }),
//             diffSourcePlugin({ viewMode: "rich-text" }),
//             toolbarPlugin({
//               toolbarContents: () => (
//                 <DiffSourceToggleWrapper>
//                   <UndoRedo />
//                   <BoldItalicUnderlineToggles />
//                   <BlockTypeSelect />
//                 </DiffSourceToggleWrapper>
//               ),
//             }),
//           ]}
//         />
//       </div>

//       {/* Inject highlighting script */}
//       <script
//         dangerouslySetInnerHTML={{
//           __html: `
//           function highlightWordInEditor(word) {
//             if (!word) {
//               // Remove all highlights
//               document.querySelectorAll('.highlight-match').forEach(el => {
//                 el.outerHTML = el.innerHTML;
//               });
//               return;
//             }

//             const containers = document.querySelectorAll('.cm-content, .mdxeditor-rich-text-editor');

//             containers.forEach(container => {
//               if (container.innerHTML.includes('<mark')) {
//                 // Remove existing highlights
//                 container.innerHTML = container.innerHTML.replace(/<mark class="highlight-match">(.*?)<\\/mark>/gi, '$1');
//               }

//               const regex = new RegExp('\\\\b(' + word + ')\\\\b', 'gi');
//               container.innerHTML = container.innerHTML.replace(regex, '<mark class="highlight-match">$1</mark>');
//             });
//           }

//           // Listen for highlight events
//           document.addEventListener('DOMContentLoaded', function() {
//             let currentWord = '';

//             const observer = new MutationObserver(function(mutations) {
//               if (currentWord) {
//                 highlightWordInEditor(currentWord);
//               }
//             });

//             const editor = document.querySelector('.advanced-highlight-container');
//             if (editor) {
//               observer.observe(editor, {
//                 childList: true,
//                 subtree: true,
//                 characterData: true
//               });

//               // Update current word from React state
//               const updateHighlight = () => {
//                 const highlightInput = document.querySelector('.word-input');
//                 if (highlightInput) {
//                   currentWord = highlightInput.value;
//                   highlightWordInEditor(currentWord);
//                 }
//               };

//               setInterval(updateHighlight, 500);
//             }
//           });
//         `,
//         }}
//       />
//     </div>
//   );
// };
