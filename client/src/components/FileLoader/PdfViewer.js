import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

function PdfViewer({ filePath }) {
  const [pdfData, setPdfData] = useState(null)
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(filePath)
        const blob = await response.blob()
        setPdfData(blob)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [filePath])

  if (!pdfData) {
    return <div>Loading...</div>
  }

  return (
    <div className="border shadow-md max-h-72 flex justify-center">
      <Document file={pdfData} onLoadError={(error) => console.error(error)}>
        <Page scale={1} renderMode="canvas" pageNumber={1} />
      </Document>
    </div>
  )
}

export default PdfViewer
