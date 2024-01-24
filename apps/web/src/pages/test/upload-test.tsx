// test page for uploading pdfs to s3
import { useState } from "react"
import { useBucket } from "@web/hooks/useBucket";
import { Document, pdfjs, Page } from "react-pdf";
// to remove extra space below pdf normally occupied by text layer
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

// the workerSrc property
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`


export default function PDFUpload() {
  const [pdf, setPdf] = useState<string | ArrayBuffer | null>(null);
  const { uploadFile } = useBucket();

  // converts the uploaded pdf to a base64 string
  const blobToUrl = (blob: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }

  // handles the pdf upload
  const handlePdfSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;

    const file = e.target.files[0];
    uploadFile(file, file.name);
    const url = await blobToUrl(file) as string | ArrayBuffer | null;

    setPdf(url);
  }

  return <>
    <input type="file" onChange={(e)=>handlePdfSubmit(e)}accept=".pdf"/>
    {pdf && <Document file={pdf}>
      <Page pageNumber={1}  renderTextLayer={false}/>
    </Document>}
  </>
}