import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { Document, Page, pdfjs } from "react-pdf";
import { uploadfileV4 } from "../API/uploadApi";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
export const Route = createFileRoute("/_auth/user/upload")({
  component: RouteComponent,
});

function RouteComponent() {
  const [files, setFiles] = useState<any[]>([]);
  const client = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});

  const handleFileChange = (event: any) => {
    const uploadedFiles = Array.from(event.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file as any),
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsUploading(true);

    const uploadPromises: any = [];
    const newUploadStatus: any = { ...uploadStatus };

    files.forEach((fileObj) => {
      uploadPromises.push(
        new Promise((resolve) => {
          const formData = new FormData();
          formData.append("file", fileObj.file);

          uploadfileV4(formData)
            .then(() => {
              newUploadStatus[fileObj.file.name] = "success";
              resolve({ status: "fulfilled" });
            })
            .catch((error) => {
              console.error("Upload failed for:", fileObj.file.name, error);
              newUploadStatus[fileObj.file.name] = "failed";
              resolve({ status: "rejected", reason: error });
            });
        })
      );
    });

    await Promise.allSettled(uploadPromises);
    setUploadStatus(newUploadStatus);
    setIsUploading(false);
    client.invalidateQueries({ queryKey: ["scripts"] });
  };
  const isUploadStatusEmpty = Object.keys(uploadStatus).length === 0;
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col items-center gap-4 mt-6">
        {/* Upload Files Heading */}
        <h1 className="text-3xl font-bold text-gray-800">Upload Files</h1>

        {/* File Select Button */}
        <label className="flex items-center gap-3 cursor-pointer bg-gray-100 px-6 py-3 rounded-lg hover:bg-gray-200 transition text-gray-700 font-medium shadow-md">
          <FaUpload size={22} className="text-blue-500" />
          <span>Select Files</span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf"
          />
        </label>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Reset Button - Only shows when uploadStatus is not empty */}
          {!isUploadStatusEmpty ? (
            <button
              onClick={() => {
                setFiles([]), setUploadStatus({});
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
            >
              <FaPlus size={18} />
              Reset
            </button>
          ) : (
            <button
              onClick={handleUpload}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md flex items-center"
            >
              {isUploading ? (
                <span className="animate-pulse">Uploading...</span>
              ) : (
                "Upload All"
              )}
            </button>
          )}

          {/* Upload Button */}
        </div>
      </div>

      <PdfGrid
        files={files}
        uploadStatus={uploadStatus}
        removeFile={removeFile}
      />
    </div>
  );
}

const PdfGrid = ({ files, uploadStatus, removeFile }: any) => {
  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <>
      {/* PDF Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {files.map((fileObj: any, index: number) => {
          const status = uploadStatus[fileObj.file.name];

          return (
            <div
              key={index}
              className={`border rounded-md mx-auto p-4 text-center bg-white shadow flex flex-col items-center max-h-60 overflow-hidden relative transition-all ${
                status === "success"
                  ? "border-green-500"
                  : status === "failed"
                    ? "border-red-500"
                    : ""
              }`}
              style={{ width: "220px" }}
            >
              {/* PDF Thumbnail */}
              <Document file={fileObj.preview} className="w-full">
                <Page pageNumber={1} width={180} />
              </Document>

              <p className="truncate text-sm font-medium mt-2">
                {fileObj.file.name}
              </p>

              {/* View & Remove Buttons */}
              {
                <div className="flex gap-2 bottom-2 mt-2 absolute w-full px-3">
                  <button
                    onClick={() => setSelectedPdf(fileObj.preview)}
                    className="bg-blue-500 text-white flex items-center justify-center px-3 py-2 rounded-md hover:bg-blue-600 transition flex-1"
                  >
                    <FcViewDetails className="w-4 h-4 mr-1" /> View
                  </button>

                  {status !== "success" && (
                    <button
                      onClick={() => removeFile(index)}
                      className="bg-red-500 text-white flex max-w-[50%] items-center justify-center px-3 py-2 rounded-md hover:bg-red-600 transition flex-1"
                    >
                      <FaTrash className="w-4 h-4 mr-1" /> Remove
                    </button>
                  )}
                </div>

                // <div className="flex gap-2 bottom-2 mt-2 absolute w-full px-3">
                //   <button
                //     onClick={() => router.navigate({ to: "/scripts/" + "123" })}
                //     className="bg-blue-500 text-white  flex items-center justify-center px-3 py-2 rounded-md hover:bg-blue-600 transition flex-1"
                //   >
                //     <FaArrowCircleDown className="w-4 h-4 mr-1" /> Open
                //   </button>
                // </div>
              }

              {/* Uploading Overlay */}
              {status === "uploading" && (
                <div className="absolute inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                  <span className="animate-pulse text-white">Uploading...</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fullscreen PDF Modal */}
      {/* PDF Modal */}
      {selectedPdf && (
        <PdfPreview selectedPdf={selectedPdf} setSelectedPdf={setSelectedPdf} />
      )}
    </>
  );
};

const PdfPreview = ({ selectedPdf, setSelectedPdf }: any) => {
  const [numPages, setNumPages] = useState(0);

  return (
    <div
      onClick={() => setSelectedPdf(null)}
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 p-4"
    >
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto ">
        {/* Close Button */}
        <button
          onClick={() => setSelectedPdf(null)}
          className="absolute top-1 right-6 bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-900"
        >
          ✕
        </button>

        {/* Full PDF Document - Display all pages */}
        <div className="overflow-y-auto w-full mx-auto flex flex-col items-center">
          <Document
            file={selectedPdf}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="w-full"
          >
            {Array.from({ length: numPages as any }, (_, index) => (
              <Page
                renderAnnotationLayer={false}
                renderTextLayer={false}
                key={index}
                pageNumber={index + 1}
                width={600}
                className=""
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};
