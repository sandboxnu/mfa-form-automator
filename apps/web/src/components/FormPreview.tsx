import { Box, Flex, Heading, HStack, Link, Text } from '@chakra-ui/react';
import { FormInstanceEntity, SignerType } from '@web/client';
import { useRef, useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { SidePreviewForm } from './SidePreviewForm';


export const FormPreview = ({
  formInstance,
  formInstanceName,
  pdfLink,
}: {
  formInstance: FormInstanceEntity;
  formInstanceName: string;
  pdfLink: string;
}) => {
  const [totalPages, setTotalPages] = useState(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize pageRefs when totalPages changes
  useEffect(() => {
    pageRefs.current = Array(totalPages).fill(null);
  }, [totalPages]);

  return (
    <>
      <Box height="100vh" marginTop="36px" overflow="hidden">
        <Flex height="100%" width="100%">
          <Box width="170px" height="100%" position="fixed" zIndex={5000}>
            <SidePreviewForm formInstance={formInstance} />
          </Box>

          <Box
            marginLeft="170px"
            height="100%"
            width="calc(100% - 170px)"
            padding="0 36px"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            <Heading
              color="#2A2B2D"
              fontSize="30px"
              fontWeight={700}
              lineHeight="38px"
              marginTop="0px"
              marginBottom="12px"
              marginLeft="0px"
            >
              Form Preview
            </Heading>

            <Flex
              flex="1"
              borderRadius="12px"
              border="1px solid #E5E5E5"
              backgroundColor="#FFF"
              padding="24px"
              overflow="hidden"
              maxHeight="calc(100vh - 180px)"
            >
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                border="1px solid #E5E5E5"
                borderRadius="12px"
                overflow="hidden"
                backgroundColor="white"
              >
                <Text
                  fontSize="14px"
                  fontFamily="Hanken Grotesk"
                  fontWeight="600"
                  paddingY="12px"
                  textAlign="center"
                  borderBottom="1px solid #E5E5E5"
                  background="white"
                >
                  {formInstanceName}
                </Text>

                <Box
                  flex="1"
                  overflowY="auto"
                  padding="12px"
                  background="#F0F0F0"
                  maxHeight="100vh"
                >
                  <Box width="100%" display="flex" justifyContent="center">
                    <Document
                      file={pdfLink}
                      onLoadSuccess={(data) => {
                        setTotalPages(data.numPages);
                      }}
                    >
                      {Array.from(new Array(totalPages), (_, index) => (
                        <div
                          key={`page_${index + 1}`}
                          ref={(el) => {
                            pageRefs.current[index] = el;
                          }}
                          style={{
                            marginBottom: '12px',
                            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                            background: 'white',
                          }}
                        >
                          <Page
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            pageNumber={index + 1}
                            width={680}
                          />
                        </div>
                      ))}
                    </Document>
                  </Box>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
