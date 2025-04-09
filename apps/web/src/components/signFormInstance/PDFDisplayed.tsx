import { Box, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import PagingControl from '../createFormTemplate/createFormTemplateEditor/PagingControl';

export const PDFDisplayed = ({
  formTemplateName,
  pdfLink,
  formFields,
}: {
  formTemplateName: string;
  pdfLink: string;
  formFields: JSX.Element[][];
}) => {
  const [pageNum, setPageNum] = useState(0);
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
        <Box display="flex" justifyContent="center">
          <Box
            height="474px"
            width="800px"
            overflow="scroll"
            display="flex"
            flexDirection="column"
          >
            <Document
              file={pdfLink}
              onLoadSuccess={(data) => {
                setTotalPages(data.numPages);
              }}
            >
              <Page
                renderAnnotationLayer={false}
                renderTextLayer={false}
                pageNumber={pageNum + 1}
                width={1000}
              >
                {formFields[pageNum]}
              </Page>
            </Document>
          </Box>
        </Box>
      </Box>
      <PagingControl
        pageNum={pageNum}
        setPageNum={setPageNum}
        totalPages={totalPages}
      />
    </Box>
  );
};
