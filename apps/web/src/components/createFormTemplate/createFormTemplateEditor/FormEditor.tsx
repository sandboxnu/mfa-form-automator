import { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Box, Text, Button } from '@chakra-ui/react';
import { TextIcon, PlusSign } from 'apps/web/src/static/icons';
import { DraggableData, DraggableEvent } from 'react-draggable';

import PagingControl from './PagingControl';
import { PDFPageProxy } from 'pdfjs-dist';
import { v4 as uuidv4 } from 'uuid';
import DraggableText from './DraggableText';

type PageCallback = PDFPageProxy & {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
};

export type TextFieldPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type groupId = string;
type fieldId = string;
type colorHex = string;

type FieldGroups = Map<groupId, colorHex>;

// index = page num (zero indexing)
type FormFields = Map<
  fieldId,
  { position: TextFieldPosition; groupId: string }
>[];

//! TEMP FORM NAME
const formName = 'Authorization Form ';

export const FormEditor = ({ pdfUrl }: { pdfUrl: string }) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  const [formFields, setFormFields] = useState<FormFields>([]);
  const [fieldGroups, setFieldGroups] = useState<FieldGroups>(new Map());
  const [currentGroup, setCurrentGroup] = useState<string>('');
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // const [pageDetails, setPageDetails] = useState<PageCallback | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [groupNum, setGroupNum] = useState(0);

  //colors for group buttons: colors[0] = border/text color, colors[1] = background color
  const groupColors = [
    ['#1367EA', '#EEF5FF'],
    ['#BD21CA', '#FDEAFF'],
    ['#7645E8', '#ECE4FF'],
    ['#567E26', '#EDFFD6'],
    ['#A16308', '#FFFDDB'],
  ];

  const handleAddField = () => {
    if (fieldGroups.size > 0) {
      const fieldId = uuidv4();
      let formFieldsCopy = [...formFields];
      formFieldsCopy[pageNum].set(fieldId, {
        position: {
          x: 0,
          y: 0,
          width: 80,
          height: 30,
        },
        groupId: currentGroup,
      });
      setFormFields(formFieldsCopy);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    const updatedFields = [...formFields];
    updatedFields[pageNum].delete(fieldId);
    setFormFields(updatedFields);
  };

  const handleFieldUpdate = (
    groupId: string,
    fieldId: string,
    pos: TextFieldPosition,
  ) => {
    let updatedFormFields = [...formFields];
    updatedFormFields[pageNum].set(fieldId, {
      position: {
        width: pos.width,
        height: pos.height,
        x: pos.x,
        y: pos.y,
      },
      groupId: groupId,
    });
    setFormFields(updatedFormFields);
  };

  const addGroup = () => {
    const myuuid = uuidv4();
    let mapCpy = new Map(fieldGroups);
    if (groupNum != 5) {
      mapCpy.set(myuuid, groupColors[groupNum][1]);
      setFieldGroups(mapCpy);
      setGroupNum(groupNum + 1);
      setCurrentGroup(myuuid);
    }
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
        {Array.from(fieldGroups.entries()).map(([key, value], index) => (
          <Button
            key={index}
            onClick={() => setCurrentGroup(key)}
            variant={'solid'}
            border={'solid 1px'}
            backgroundColor={
              currentGroup === key ? groupColors[index][1] : 'white'
            }
            borderColor={
              currentGroup === key ? groupColors[index][0] : '#1367EA'
            }
            textColor={currentGroup === key ? groupColors[index][0] : '#1367EA'}
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
          {formName}
        </Text>
        <Box display="flex" justifyContent="center">
          <Box
            position="absolute"
            left="24px"
            top="69px"
            background="white"
            padding="6px"
            boxShadow="0px 1px 4px #E5E5E5"
            borderRadius="5px"
            border="1px #E5E5E5 solid"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="8px"
            display="flex"
          >
            <Button
              position="relative"
              width="40px"
              height="40px"
              backgroundColor="#1367EA"
              borderRadius="4px"
              border="1px #E5E5E5 solid"
              display="flex"
              justifyContent="center"
              alignItems="center"
              isDisabled={fieldGroups.size == 0}
              onClick={handleAddField}
            >
              <div>{TextIcon}</div>
            </Button>
          </Box>
          <Box
            height="474px"
            width="1000px"
            overflow="scroll"
            ref={documentRef}
            display="flex"
            flexDirection="column"
          >
            {/* {signatureURL ? (
                <DraggableSignature
                  url={signatureURL}
                  onCancel={() => {
                    setSignatureURL(null);
                  }}
                  onSet={async () => {
                    if (
                      pageDetails &&
                      documentRef &&
                      documentRef.current &&
                      position
                    ) {
                      const { originalHeight, originalWidth } = pageDetails;
                      const scale =
                        originalWidth / documentRef.current.clientWidth;

                      const y =
                        documentRef.current.clientHeight -
                        (position.y -
                          position.height +
                          64 -
                          documentRef.current.offsetTop);
                      const x =
                        position.x -
                        160 -
                        position.width -
                        documentRef.current.offsetLeft;

                      // new XY in relation to actual document size
                      const newY =
                        (y * originalHeight) / documentRef.current.clientHeight;
                      const newX =
                        (x * originalWidth) / documentRef.current.clientWidth;

                      const pdfDoc = await PDFDocument.load(pdf);

                      const pages = pdfDoc.getPages();
                      const firstPage = pages[pageNum];

                      const pngImage = await pdfDoc.embedPng(signatureURL);
                      const pngDims = pngImage.scale(scale * 0.3);

                      firstPage.drawImage(pngImage, {
                        x: newX,
                        y: newY,
                        width: pngDims.width,
                        height: pngDims.height,
                      });

                      const pdfBytes = await pdfDoc.save();
                      const blob = new Blob([new Uint8Array(pdfBytes)]);

                      // const URL = await blobToURL(blob);
                      // setPdf(URL);
                      setPosition(null);
                      setSignatureURL(null);
                    }
                  }}
                  onEnd={(e: DraggableEvent, data: DraggableData) =>
                    setPosition({
                      width: data.deltaX,
                      height: data.deltaY,
                      x: data.x,
                      y: data.y,
                    })
                  }
                />
              ) : null} */}
            <Document
              file={pdfUrl}
              onLoadSuccess={(data) => {
                setTotalPages(data.numPages);
                let arr = [];
                for (let i = 0; i <= data.numPages; i++) {
                  arr.push(new Map());
                }
                setFormFields(arr);
              }}
            >
              <Page
                width={1000}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                pageNumber={pageNum + 1}
                onLoadSuccess={(page: PageCallback) => {
                  // setPageDetails(page);
                }}
              >
                {formFields[pageNum] &&
                  Array.from(formFields[pageNum].entries()).map(
                    ([fieldId, { position, groupId }], index) => (
                      <DraggableText
                        currentPosition={position}
                        onRemove={() => {
                          handleRemoveField(fieldId);
                        }}
                        key={index}
                        color={fieldGroups.get(groupId) ?? '#000'}
                        initialText={null}
                        onStop={(e: DraggableEvent, data: DraggableData) => {
                          handleFieldUpdate(groupId, fieldId, {
                            width: position.width,
                            height: position.height,
                            x: data.x,
                            y: data.y,
                          });
                        }}
                        onResizeStop={(
                          e: MouseEvent | TouchEvent,
                          dir,
                          elementRef,
                          delta,
                          pos,
                        ) => {
                          let newWidth = parseFloat(elementRef.style.width);
                          let newHeight = parseFloat(elementRef.style.height);
                          handleFieldUpdate(groupId, fieldId, {
                            width: Number.isNaN(newWidth)
                              ? position.width
                              : newWidth,
                            height: Number.isNaN(newHeight)
                              ? position.height
                              : newHeight,
                            x: pos.x,
                            y: pos.y,
                          });
                        }}
                      />
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
