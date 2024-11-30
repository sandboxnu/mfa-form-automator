import { Document, Page, pdfjs } from 'react-pdf';
import { Box, Button } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import DraggableText from './DraggableText';
import { PDFPageProxy } from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';
import PagingControl from './PagingControl';
import { PlusSign, TextIcon } from './../../../static/icons';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type FormEditorProps = {
  pdfUrl: string; // URL of the PDF to load
  initialFormFieldGroups?: Map<
    string,
    { fields: Map<string, TextFieldPosition>; color: string }
  >; // Optional initial fields
  onFieldsUpdate?: (
    formFieldGroups: Map<
      string,
      { fields: Map<string, TextFieldPosition>; color: string }
    >,
  ) => void; // Callback for field updates
  currentPage?: number; // Initial page to display
  onPageChange?: (pageNumber: number) => void; // Callback for page changes
  allowFieldAdd?: boolean; // Control if new fields can be added
};

type PageCallback = PDFPageProxy & {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
};

type TextFieldPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const FormEditor = ({
  pdfUrl,
  initialFormFieldGroups = new Map(),
  currentPage = 0,
  allowFieldAdd = true,
}: FormEditorProps) => {
  const [formFieldGroups, setFormFieldGroups] = useState(
    initialFormFieldGroups,
  );
  const [pageNum, setPageNum] = useState(currentPage);
  const [totalPages, setTotalPages] = useState(0);
  const [pageDetails, setPageDetails] = useState<PageCallback | null>(null);
  const [currentGroup, setCurrentGroup] = useState<string>('');
  const documentRef = useRef<HTMLDivElement>(null);

  const handleAddField = () => {
    if (!allowFieldAdd || !currentGroup || !pageDetails) {
      return;
    }

    const fieldId = uuidv4();
    const updatedGroups = new Map(formFieldGroups);
    updatedGroups.get(currentGroup)?.fields.set(fieldId, {
      x: 0,
      y: 0,
      width: 80,
      height: 30,
    });

    setFormFieldGroups(updatedGroups);
  };

  const handleFieldUpdate = (
    groupId: string,
    fieldId: string,
    pos: TextFieldPosition,
  ) => {
    const updatedGroups = new Map(formFieldGroups);
    updatedGroups.get(groupId)?.fields.set(fieldId, pos);
    setFormFieldGroups(updatedGroups);
  };

  const addGroup = () => {
    const myuuid = uuidv4();
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const newFormFieldGroups = new Map(formFieldGroups);
    newFormFieldGroups.set(myuuid, {
      fields: new Map(),
      color: randomColor,
    });
    setFormFieldGroups(newFormFieldGroups);
    setCurrentGroup(myuuid);
  };

  return (
    <Box
      background="white"
      padding="24px"
      borderRadius="12px"
      border="1px #E5E5E5 solid"
      display="flex"
      flexDir="column"
      gap="20px"
    >
      <Box display="flex" gap="12px">
        {Array.from(formFieldGroups.entries()).map(([key, value], index) => (
          <Button
            key={index}
            onClick={() => setCurrentGroup(key)}
            variant={currentGroup === key ? 'solid' : 'outline'}
            colorScheme="blue"
          >
            Group {index + 1}
          </Button>
        ))}

        <Button
          backgroundColor="white"
          border="1px solid #1367EA"
          onClick={addGroup}
        >
          {PlusSign}
          <span
            style={{
              fontFamily: 'Hanken Grotesk',
              fontSize: '16px',
              color: '#1367EA',
              fontWeight: 600,
              lineHeight: '22px',
              textAlign: 'left',
              marginLeft: '6px',
            }}
          >
            Add group
          </span>
        </Button>
      </Box>
      <Box
        background="#F6F5F5"
        borderRadius="8px"
        border="1px #E5E5E5 solid"
        height="525px"
        position="relative"
      >
        <Box display="flex" justifyContent="center">
          {allowFieldAdd && (
            <Box
              position="absolute"
              left="24px"
              top="69px"
              background="white"
              padding="6px"
              boxShadow="0px 1px 4px #E5E5E5"
              borderRadius="5px"
              border="1px #E5E5E5 solid"
            >
              <Button
                width="32px"
                height="32px"
                backgroundColor="#1367EA"
                color="white"
                onClick={handleAddField}
              >
                {TextIcon}
              </Button>
            </Box>
          )}
          <Box
            marginTop="1px"
            height="475px"
            width="662px"
            overflow="scroll"
            ref={documentRef}
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={(data) => setTotalPages(data.numPages)}
            >
              <Page
                pageNumber={pageNum + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onLoadSuccess={(page: PageCallback) => setPageDetails(page)}
              >
                {Array.from(formFieldGroups.entries()).map(
                  ([groupId, group], index) =>
                    Array.from(group.fields.entries()).map(
                      ([fieldId, field]) => (
                        <DraggableText
                          key={fieldId}
                          color={group.color}
                          onRemove={() => {
                            const updatedGroups = new Map(formFieldGroups);
                            updatedGroups.get(groupId)?.fields.delete(fieldId);
                            setFormFieldGroups(updatedGroups);
                          }}
                          onStop={(e, data) => {
                            handleFieldUpdate(groupId, fieldId, {
                              ...field,
                              x: data.x,
                              y: data.y,
                            });
                          }}
                          onResizeStop={(
                            e,
                            dir,
                            elementRef,
                            delta,
                            position,
                          ) => {
                            handleFieldUpdate(groupId, fieldId, {
                              ...field,
                              width: parseFloat(elementRef.style.width),
                              height: parseFloat(elementRef.style.height),
                              x: position.x,
                              y: position.y,
                            });
                          }}
                          initialText={''}
                          {...field}
                        />
                      ),
                    ),
                )}
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
