import { Box, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';

export const PDFDisplayed = ({
  formTemplateName,
  pdfLink,
  formFields,
}: {
  formTemplateName: string;
  pdfLink: string;
  formFields: JSX.Element[][];
}) => {
  const [totalPages, setTotalPages] = useState(0);

  return (
    <Box
      background="white"
      borderRadius="12px"
      display="flex"
      flexDir="column"
      gap="20px"
      width="100%"
    >
      <Box
        background="#F6F5F5"
        borderRadius="8px"
        border="1px #E5E5E5 solid"
        height="525"
        position="relative"
      >
        <Text
          borderTopRadius="8px"
          borderBottom="1px #E5E5E5 solid "
          fontSize="14px"
          fontFamily="Hanken Grotesk"
          fontWeight="600"
          paddingTop="12px"
          paddingBottom="12px"
          textAlign="center"
          background="white"
        >
          {formTemplateName}
        </Text>
        <div style={{ overflowY: 'auto', maxHeight: '800px' }}>
          <Document
            file={pdfLink}
            onLoadSuccess={(data) => setTotalPages(data.numPages)}
          >
            {Array.from(new Array(totalPages), (_, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      </Box>
    </Box>
  );
};
