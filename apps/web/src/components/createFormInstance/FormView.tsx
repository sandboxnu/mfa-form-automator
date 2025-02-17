import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Text } from '@chakra-ui/react';
import PagingControl from '../createFormTemplate/createFormTemplateEditor/PagingControl';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const FormView = ({
  pdfUrl,
}: {
  formTemplateName: string;
  pdfUrl: string;
}) => {
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  return (
    <Box
      background="white"
      borderRadius="0px"
      width="100%"
      display="flex"
      flexDir="column"
      gap="20px"
    >
      <Box
        background="#F6F5F5"
        borderRadius="5px"
        border="1px #E5E5E5 solid"
        height="525px"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box height="100%" width="100%" overflow="auto" display="flex" justifyContent="center">
        <Document
            file={pdfUrl}
            onLoadSuccess={(data) => setTotalPages(data.numPages)}
            
          >
            <Page
              width={1000}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              pageNumber={pageNum + 1}
            />
          </Document>
        </Box>
      </Box>
      <PagingControl pageNum={pageNum} setPageNum={setPageNum} totalPages={totalPages} />
    </Box>
  );
};
