import React from 'react';
import { Document, Page } from 'react-pdf';

const PDFViewer = ({ pdf } : { pdf: string | ArrayBuffer | null }) => {
  return (
    <>
      {pdf && (
        <Document file={pdf} onLoadSuccess={(data) => console.log(data)}>
          <Page pageNumber={1} renderTextLayer={false} />
        </Document>
      )}
    </>
  );
};

export default PDFViewer;
