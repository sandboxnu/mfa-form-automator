import React from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

export function PDFDocument({ formLink }: { formLink: string }) {
  return (
    <>
      <Document file={formLink}>
        <Page pageNumber={1} />
      </Document>
    </>
  );
}
