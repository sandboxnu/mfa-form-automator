import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PDFDocument({ formLink }: { formLink: string }) {
  return (
    <>
      <Document file={formLink}>
        <Page pageNumber={1} />
      </Document>
    </>
  );
}
