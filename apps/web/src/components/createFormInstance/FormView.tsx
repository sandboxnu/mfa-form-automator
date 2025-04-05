import { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Text } from '@chakra-ui/react';
import PagingControl from '../createFormTemplate/createFormTemplateEditor/PagingControl';
import { FieldGroupBaseEntity } from '@web/client/types.gen';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Colors for different field groups
const groupColors = [
  ['#1367EA', '#EEF5FF'],
  ['#BD21CA', '#FDEAFF'],
  ['#7645E8', '#ECE4FF'],
  ['#567E26', '#EDFFD6'],
  ['#A16308', '#FFFDDB'],
];

// PDF and container dimensions
const PDF_WIDTH = 1000;
const CONTAINER_WIDTH = 800;

export const FormView = ({
  formTemplateName,
  pdfUrl,
  fieldGroups,
  scale = 0.6875,
}: {
  formTemplateName: string;
  pdfUrl: string;
  fieldGroups: FieldGroupBaseEntity[];
  scale?: number;
}) => {
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { assignedGroupData } = useCreateFormInstance();
  const textRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // to calculate box dimensions
  const calculateDimensions = (type: string, assignedTo: string) => {
    
    let minWidth = 80;
    let height = 30;
    
    if (type === 'CHECKBOX') {
      minWidth = height = 30;
    } else if (type === 'SIGNATURE') {
      minWidth = 150;
      height = 50;
    }

    const key = `${assignedTo}-${type}`;
    const textElement = textRefs.current[key];
    let width = minWidth;
    
    if (textElement) {
      const textWidth = textElement.scrollWidth + 20;
      width = Math.max(minWidth, textWidth);
    }

    return { width, height };
  };

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
        <Box display="flex" justifyContent="center">
          <Box
            height="474px"
            width="800px"
            overflow="scroll"
            display="flex"
            flexDirection="column"
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={(data) => {
                setTotalPages(data.numPages);
              }}
            >
              <Box position="relative">
                <Page
                  width={1000}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  pageNumber={pageNum + 1}
                />
                {/* Hidden text elements for measuring */}
                <Box position="absolute" visibility="hidden" pointerEvents="none">
                  {fieldGroups?.map((fieldGroup, groupIndex) => {
                    const assignedTo = assignedGroupData[groupIndex]?.name || 'Unassigned';
                    return fieldGroup.templateBoxes.map((box, boxIndex) => (
                      <Text
                        key={`measure-${groupIndex}-${boxIndex}`}
                        ref={el => textRefs.current[`${assignedTo}-${box.type}`] = el}
                        fontSize="12px"
                        fontWeight="500"
                      >
                        {assignedTo}
                      </Text>
                    ));
                  })}
                </Box>
                {fieldGroups?.map((fieldGroup, groupIndex) => {
                  const [borderColor, bgColor] = groupColors[groupIndex % groupColors.length];
                  const assignedTo = assignedGroupData[groupIndex]?.name || 'Unassigned';
                  
                  return fieldGroup.templateBoxes.map((box, boxIndex) => {
                    // Calculate dimensions
                    const { width, height } = calculateDimensions(box.type, assignedTo);

                    // Scale the coordinates
                    const x = box.x_coordinate * scale;
                    const y = box.y_coordinate * scale;
                    const scaledWidth = width * scale;
                    const scaledHeight = height * scale;

                    return (
                      <Box
                        key={`${groupIndex}-${boxIndex}`}
                        position="absolute"
                        left={`${x}px`}
                        top={`${y}px`}
                        width={`${scaledWidth}px`}
                        height={`${scaledHeight}px`}
                        border={`1px solid ${borderColor}`}
                        backgroundColor={bgColor}
                        opacity="0.7"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        _hover={{
                          opacity: "1",
                        }}
                      >
                        <Text
                          fontSize="12px"
                          color={borderColor}
                          fontWeight="500"
                          textAlign="center"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          width="100%"
                          paddingX="4px"
                        >
                          {assignedTo}
                        </Text>
                      </Box>
                    );
                  });
                })}
              </Box>
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
