import { useState } from 'react';
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

export const FormView = ({
  formTemplateName,
  pdfUrl,
  fieldGroups,
  scale = 1,
}: {
  formTemplateName: string;
  pdfUrl: string;
  fieldGroups: FieldGroupBaseEntity[];
  scale?: number;
}) => {
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { assignedGroupData } = useCreateFormInstance();

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
                {fieldGroups?.map((fieldGroup, groupIndex) => {
                  const [borderColor, bgColor] = groupColors[groupIndex % groupColors.length];
                  const assignedTo = assignedGroupData[groupIndex]?.name || 'Unassigned';
                  
                  return fieldGroup.templateBoxes.map((box, boxIndex) => {
                    // Calculate dimensions based on field type
                    let width = 80; // Default for text fields
                    let height = 30;
                    if (box.type === 'CHECKBOX') {
                      width = height = 10;
                    } else if (box.type === 'SIGNATURE') {
                      width = 150;
                      height = 50;
                    }

                    return (
                      <Box
                        key={`${groupIndex}-${boxIndex}`}
                        position="absolute"
                        left={`${box.x_coordinate * scale}px`}
                        top={`${box.y_coordinate * scale}px`}
                        width={`${width * scale}px`}
                        height={`${height * scale}px`}
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
