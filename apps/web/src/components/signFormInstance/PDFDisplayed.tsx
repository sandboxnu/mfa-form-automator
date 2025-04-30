import { Box, Text } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import PagingControl from '../createFormTemplate/createFormTemplateEditor/PagingControl';
import { debounce } from '@web/utils/misc';
import {
  PDF_HEIGHT_PX,
  PDF_WIDTH_PX,
} from '@web/components/createFormTemplate/utils';
import React from 'react';

export const PDFDisplayed = ({
  formTemplateName,
  pdfLink,
  formFields,
  formTemplateDimensions = { width: PDF_WIDTH_PX, height: PDF_HEIGHT_PX },
}: {
  formTemplateName: string;
  pdfLink: string;
  formFields: JSX.Element[][];
  formTemplateDimensions?: {
    width: number;
    height: number;
  };
}) => {
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const documentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [displayDimensions, setDisplayDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  // Calculate scaling factors for field positioning
  const heightScale = displayDimensions.height / formTemplateDimensions.height;
  const widthScale = displayDimensions.width / formTemplateDimensions.width;

  // Update display dimensions when page changes or window resizes
  useEffect(() => {
    // Immediate update function without debounce for continuous updates
    const updateDisplayDimensions = () => {
      if (documentRef.current) {
        const rect = documentRef.current.getBoundingClientRect();
        setDisplayDimensions({ width: rect.width, height: rect.height });
      }
    };

    // Initial update
    updateDisplayDimensions();

    // Use requestAnimationFrame for smoother updates during resize
    let rafId: number;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateDisplayDimensions);
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [pageNum]);

  // Scale form fields based on display dimensions
  const scaledFormFields = formFields.map((pageFields) => {
    // If no display dimensions yet, return original fields
    if (displayDimensions.width === 0) return pageFields;

    // Clone and modify the fields with updated positions and dimensions
    return pageFields.map((field) => {
      // Clone the field element with new props
      return React.cloneElement(field, {
        currentPosition: {
          x: field.props.currentPosition.x * widthScale,
          y: field.props.currentPosition.y * heightScale,
          width: field.props.currentPosition.width * widthScale,
          height: field.props.currentPosition.height * heightScale,
        },
      });
    });
  });

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
            overflow="auto"
            display="flex"
            flexDirection="column"
            ref={containerRef}
          >
            <Document
              file={pdfLink}
              onLoadSuccess={(data) => {
                setTotalPages(data.numPages);
              }}
            >
              <Page
                inputRef={documentRef}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                pageNumber={pageNum + 1}
                onRenderSuccess={() => {
                  // Set dimensions based on the PDF page size
                  if (documentRef.current) {
                    const rect = documentRef.current.getBoundingClientRect();
                    setDisplayDimensions({
                      width: rect.width,
                      height: rect.height,
                    });
                  }
                }}
              >
                {scaledFormFields[pageNum]}
              </Page>
            </Document>
          </Box>
        </Box>
        <PagingControl
          pageNum={pageNum}
          setPageNum={setPageNum}
          totalPages={totalPages}
        />
      </Box>
    </Box>
  );
};
