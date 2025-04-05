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
  pdfUrl,
  fieldGroups,
}: {
  formTemplateName: string;
  pdfUrl: string;
  fieldGroups?: FieldGroupBaseEntity[];
}) => {
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { assignedGroupData } = useCreateFormInstance();

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
        <Box
          height="100%"
          width="100%"
          overflow="auto"
          display="flex"
          justifyContent="center"
          position="relative"
        >
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
            {/* Overlay the template boxes */}
            {fieldGroups?.map((fieldGroup, groupIndex) => {
              const [borderColor, bgColor] = groupColors[groupIndex % groupColors.length];
              const assignedTo = assignedGroupData[groupIndex]?.name || 'Unassigned';
              
              return fieldGroup.templateBoxes.map((box, boxIndex) => (
                <Box
                  key={`${groupIndex}-${boxIndex}`}
                  position="absolute"
                  left={`${box.x_coordinate}px`}
                  top={`${box.y_coordinate}px`}
                  width="80px"
                  height="30px"
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
                    truncate
                  >
                    {assignedTo}
                  </Text>
                </Box>
              ));
            })}
          </Document>
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
