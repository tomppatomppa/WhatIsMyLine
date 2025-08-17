//@ts-nocheck
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import { uploadfileV4 } from "../API/uploadApi";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const Route = createFileRoute("/_auth/user/upload")({
  component: RouteComponent,
});

function RouteComponent() {
  const client = useQueryClient();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!event.target.files) return;
  //   const uploadedFiles = Array.from(event.target.files).map((file) => ({
  //     file,
  //     preview: URL.createObjectURL(file as any),
  //   }));
  //   setFiles((prev) => [...prev, ...uploadedFiles]);
  //   event.target.value = "";
  // };
  const handleFiles = (fileList: FileList) => {
    const uploadedFiles = Array.from(fileList)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        file, // ✅ keep the File object
        preview: URL.createObjectURL(file),
        id: Date.now() + Math.random(),
      }));
      //@ts-ignore
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const removeFile = (id) => {
    setFiles(files.filter((file) => file.id !== id));
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove) {
      const newStatus = { ...uploadStatus };
      //@ts-ignore
      delete newStatus[fileToRemove.file.name];
      setUploadStatus(newStatus);
    }
  };
  const handleUpload = async () => {
    setIsUploading(true);
    const uploadPromises: any = [];
    const newUploadStatus: any = { ...uploadStatus };
    files.forEach((fileObj) => {
      uploadPromises.push(
        new Promise((resolve) => {
          const formData = new FormData();
          console.log("Uploading:", {
            name: fileObj.file?.name,
            size: fileObj.file?.size,
            type: fileObj.file?.type,
            isFile: fileObj.file instanceof File,
          });
          formData.append("file", fileObj.file, fileObj.file.name);
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
  // const handleUpload = async () => {
  //   if (files.length === 0) return;

  //   setIsUploading(true);
  //   const newUploadStatus = {};

  //   // Set all files to uploading status
  //   files.forEach((fileObj) => {
  //     newUploadStatus[fileObj.file.name] = "uploading";
  //   });
  //   setUploadStatus({ ...newUploadStatus });

  //   // Simulate upload process for each file
  //   for (const fileObj of files) {
  //     try {
  //       const formData = new FormData();
  //       formData.append("file", fileObj.file);

  //       // Simulate API call delay
  //       await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  //       // Simulate success/failure (90% success rate)
  //       if (Math.random() > 0.1) {
  //         newUploadStatus[fileObj.file.name] = "success";
  //       } else {
  //         throw new Error("Upload failed");
  //       }
  //     } catch (error) {
  //       newUploadStatus[fileObj.file.name] = "failed";
  //     }

  //     setUploadStatus({ ...newUploadStatus });
  //   }

  //   setIsUploading(false);
  // };

  const resetAll = () => {
    setFiles([]);
    setUploadStatus({});
    setIsUploading(false);
  };

  const getUploadStats = () => {
    const total = files.length;
    const uploaded = Object.values(uploadStatus).filter(
      (status) => status === "success"
    ).length;
    const failed = Object.values(uploadStatus).filter(
      (status) => status === "failed"
    ).length;
    const uploading = Object.values(uploadStatus).filter(
      (status) => status === "uploading"
    ).length;

    return { total, uploaded, failed, uploading };
  };

  const stats = getUploadStats();
  const hasUploads = Object.keys(uploadStatus).length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100">
        <div className="absolute w-80 h-80 bg-gradient-radial from-slate-200/60 to-slate-300/20 rounded-full -top-24 -left-12 animate-float"></div>
        <div className="absolute w-96 h-96 bg-gradient-radial from-slate-100/80 to-slate-200/30 rounded-full -bottom-36 -right-24 animate-float-reverse"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-slate-300 rounded-full opacity-30 animate-float-small"></div>
      <div className="absolute bottom-32 right-20 w-3 h-3 bg-slate-200 rounded-full opacity-20 animate-float-reverse"></div>
      <div className="absolute top-1/2 right-10 w-1.5 h-1.5 bg-slate-400 rounded-full opacity-25 animate-float"></div>

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="mb-8 p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white/50 transition-all duration-200 hover:-translate-x-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          {/* Header Card */}
          <div className="text-center mb-8">
            <div className="bg-white/95 backdrop-blur-lg border border-slate-200/50 rounded-xl p-8 shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <h1 className="text-3xl font-light text-slate-800 mb-2">
                Upload Your Files
              </h1>
              <p className="text-slate-500">
                Drag and drop your PDF files or click to browse
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white/95 backdrop-blur-lg border border-slate-200/50 rounded-xl p-8 mb-6 shadow-xl">
            <div
              className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
                dragActive
                  ? "border-slate-400 bg-slate-50/50"
                  : "border-slate-300 hover:border-slate-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-slate-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <div className="mb-4">
                  <label className="cursor-pointer">
                    <span className="text-lg font-medium text-slate-700 hover:text-slate-800 transition-colors">
                      Click to upload files
                    </span>
                    <span className="text-slate-500"> or drag and drop</span>
                    <input
                      ref={inputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf"
                    />
                  </label>
                </div>
                <p className="text-sm text-slate-400">
                  PDF files only, up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {/* Upload Statistics */}
          {hasUploads && (
            <div className="bg-white/95 backdrop-blur-lg border border-slate-200/50 rounded-xl p-6 mb-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {stats.uploaded} uploaded
                    </span>
                  </div>
                  {stats.failed > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        {stats.failed} failed
                      </span>
                    </div>
                  )}
                  {stats.uploading > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium text-slate-600">
                        {stats.uploading} uploading...
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="flex-1 max-w-xs mx-4">
                  <div className="bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-slate-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.total > 0 ? (stats.uploaded / stats.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-sm text-slate-500">
                  {stats.uploaded}/{stats.total} complete
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {files.length > 0 && (
            <div className="flex justify-center space-x-4 mb-8">
              {!isUploading && !hasUploads && (
                <button
                  onClick={handleUpload}
                  className="bg-slate-800 text-white px-8 py-4 rounded-lg hover:bg-slate-900 transition-all duration-200 font-medium shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Upload {files.length} file{files.length !== 1 ? "s" : ""}
                </button>
              )}

              {hasUploads && (
                <button
                  onClick={resetAll}
                  className="bg-white border border-slate-300 text-slate-700 px-8 py-4 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Upload More Files
                </button>
              )}

              {files.length > 0 && (
                <button
                  onClick={resetAll}
                  className="bg-white border border-red-200 text-red-600 px-6 py-4 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-medium shadow-md hover:-translate-y-0.5"
                >
                  Clear All
                </button>
              )}
            </div>
          )}

          {/* Files Grid */}
          {files.length > 0 && (
            <PdfGrid
              files={files}
              uploadStatus={uploadStatus}
              removeFile={removeFile}
              isUploading={isUploading}
            />
          )}
        </div>
      </div>

      {/* Custom Styles */}
   
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 30px) scale(1.05);
          }
        }

        @keyframes float-reverse {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-20px, 30px) scale(0.95);
          }
          50% {
            transform: translate(15px, -25px) scale(1.1);
          }
          75% {
            transform: translate(-30px, -20px) scale(1.05);
          }
        }

        @keyframes float-small {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 25s ease-in-out infinite;
        }

        .animate-float-small {
          animation: float-small 15s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
//@ts-ignore
const PdfGrid = ({ files, uploadStatus, removeFile, isUploading }) => {
  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
        {files.map((fileObj: any) => {
          const status = uploadStatus[fileObj.file.name];
          const fileSize = (fileObj.file.size / (1024 * 1024)).toFixed(2);

          return (
            <div
              key={fileObj.id}
              className={`bg-white/95 backdrop-blur-lg border rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                status === "success"
                  ? "border-green-200/50 bg-green-50/30"
                  : status === "failed"
                    ? "border-red-200/50 bg-red-50/30"
                    : status === "uploading"
                      ? "border-slate-300/50 bg-slate-50/30"
                      : "border-slate-200/50"
              }`}
            >
              <div className="relative p-6">
                {/* File Icon and Preview */}
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-20 bg-red-100/80 rounded-lg flex items-center justify-center mb-3 relative">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4">
                    {status === "success" && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                    )}
                    {status === "failed" && (
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </div>
                    )}
                    {status === "uploading" && (
                      <div className="w-6 h-6 border-2 border-slate-500 border-t-transparent rounded-full animate-spin shadow-sm"></div>
                    )}
                  </div>
                </div>

                {/* File Info */}
                <div className="text-center mb-4">
                  <h3 className="text-sm font-medium text-slate-800 truncate mb-1">
                    {fileObj.file.name}
                  </h3>
                  <p className="text-xs text-slate-500">{fileSize} MB</p>

                  {status === "uploading" && (
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Uploading...
                    </p>
                  )}
                  {status === "success" && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Upload complete
                    </p>
                  )}
                  {status === "failed" && (
                    <p className="text-xs text-red-600 font-medium mt-1">
                      Upload failed
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedPdf(fileObj.preview)}
                    className="flex-1 bg-slate-100 text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-200 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-1 hover:-translate-y-0.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                    <span>Preview</span>
                  </button>

                  {status !== "success" && !isUploading && (
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="bg-red-50 text-red-600 py-2 px-3 rounded-lg hover:bg-red-100 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PDF Preview Modal */}
      {selectedPdf && (
        <PdfPreview selectedPdf={selectedPdf} setSelectedPdf={setSelectedPdf} />
      )}
    </>
  );
};
//@ts-ignore
export const PdfPreview = ({ selectedPdf, setSelectedPdf }) => {
  const [numPages, setNumPages] = useState(0);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg border border-slate-200/50 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
          <h3 className="text-lg font-light text-slate-800">PDF Preview</h3>
          <button
            onClick={() => setSelectedPdf(null)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* PDF Content */}
        <div className="md:p-6 overflow-y-auto max-h-[80vh]">
          <div className="bg-slate-50 rounded-lg md:p-12 text-center">
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

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-200/50 bg-slate-50/30">
          <button
            onClick={() => setSelectedPdf(null)}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all duration-200 font-medium hover:-translate-y-0.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
