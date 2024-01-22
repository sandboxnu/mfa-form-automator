import { Button } from '@chakra-ui/react';
import { UploadForm } from '@web/static/icons';
import { useState } from 'react';
import { Document, pdfjs, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFUpload() {
  const [pdf, setPdf] = useState<string | ArrayBuffer | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);

  const blobToUrl = (blob: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const handlePdfSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;

    const file = e.target.files[0];
    const url = (await blobToUrl(file)) as string | ArrayBuffer | null;
    setPdf(url);
    setPdfName(file.name);
  };

  return (
    <>
      <Button
        width="160px"
        height="40px"
        borderRadius="8px"
        border="1px"
        background="white"
        borderColor="#4C658A"
      >
        <UploadForm color="#4C658A" width="24px" height="24px" />
        <label
          htmlFor="pdfInput"
          style={{
            fontFamily: 'Hanken Grotesk',
            fontSize: '17px',
            fontWeight: 700,
            color: '#4C658A',
            cursor: 'pointer',
            paddingLeft: '10px',
          }}
        >
          Upload File
        </label>
      </Button>
      <input
        type="file"
        id="pdfInput"
        onChange={(e) => handlePdfSubmit(e)}
        accept=".pdf"
        style={{ display: 'none' }}
      />
      {pdfName && (
        <span
          style={{
            color: '#000',
            fontFamily: 'Hanken Grotesk',
            fontSize: '17px',
            fontStyle: 'italic',
            fontWeight: '400',
            lineHeight: 'normal',
            paddingLeft: '15px',
          }}
        >
          {pdfName}
        </span>
      )}
      {pdf && (
        <Document file={pdf} onLoadSuccess={(data) => console.log(data)}>
          <Page pageNumber={1} renderTextLayer={false} />
        </Document>
      )}
    </>
  );
}
