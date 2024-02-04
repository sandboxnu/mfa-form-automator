import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ pdf }: { pdf: string | ArrayBuffer | null }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  return (
    <>
      {pdf && (
        <Document
          file={pdf}
          onLoadSuccess={(data) => setNumPages(data.numPages)}
        >
          {Array.from(new Array(numPages || 0), (_, index) => (
            <Page
              key={index + 1}
              pageNumber={index + 1}
              renderTextLayer={false}
            />
          ))}
        </Document>
      )}
    </>
  );
};

export default PDFViewer;
