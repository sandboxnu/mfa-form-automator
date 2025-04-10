import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Box } from '@chakra-ui/react';

export const FormView = ({
  pdfUrl,
  useEmbed = false,
}: {
  pdfUrl: string;
  useEmbed?: boolean;
}) => {
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
      {!useEmbed ? (
        <>
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
            <Box
              height="100%"
              width="100%"
              overflow="auto"
              display="flex"
              justifyContent="center"
            >
              <div style={{ overflowY: 'auto', maxHeight: '800px' }}>
                <Document
                  file={pdfUrl}
                  onLoadSuccess={(data) => setTotalPages(data.numPages)}
                >
                  {Array.from(new Array(totalPages), (_, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                  ))}
                </Document>
              </div>
            </Box>
          </Box>
        </>
      ) : (
        <embed style={{ height: '525px' }} src={pdfUrl}></embed>
      )}
    </Box>
  );
};
