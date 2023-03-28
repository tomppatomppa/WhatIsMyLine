import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

function PdfViewer({ file }) {
  const [pdfData, setPdfData] = useState(file)

  return (
    <div className="border shadow-md ">
      <Document file={pdfData} onLoadError={(error) => console.error(error)}>
        <Page pageNumber={1} />
      </Document>
    </div>
  )
}

export default PdfViewer
