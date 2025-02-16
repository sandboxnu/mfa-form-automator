import { Box, Button, Text } from '@chakra-ui/react';
import { Checkbox, PlusSign, TextIcon } from 'apps/web/src/static/icons';
import { useRef, useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { Document, Page, pdfjs } from 'react-pdf';
import { v4 as uuidv4 } from 'uuid';
import {
  Field,
  FieldGroups,
  FieldType,
  FormFields,
  SelectedField,
  TextFieldPosition,
} from '../types';
import DraggableTextFactory from './DraggableTextFactory';
import PagingControl from './PagingControl';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const FormEditor = ({
  formTemplateName,
  pdfUrl,
  disableEdit,
  formFields,
  setFormFields,
  fieldGroups,
  setFieldGroups,
  scale,
}: {
  formTemplateName: string;
  pdfUrl: string;
  disableEdit: boolean;
  formFields: FormFields;
  setFormFields: (fields: FormFields) => void;
  fieldGroups: FieldGroups;
  setFieldGroups: (groups: FieldGroups) => void;
  scale: number;
}) => {
  const [currentGroup, setCurrentGroup] = useState<string>(
    fieldGroups.keys().next().value ?? '',
  );
  const [pageNum, setPageNum] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const documentRef = useRef<HTMLDivElement>(null);
  const [groupNum, setGroupNum] = useState(fieldGroups.size);
  const [selectedField, setSelectedField] = useState<string>();

  //colors for group buttons: colors[0] = border/text color, colors[1] = background color
  const groupColors = [
    ['#1367EA', '#EEF5FF'],
    ['#BD21CA', '#FDEAFF'],
    ['#7645E8', '#ECE4FF'],
    ['#567E26', '#EDFFD6'],
    ['#A16308', '#FFFDDB'],
  ];

  const handleAddTextField = () => {
    if (fieldGroups.size > 0 && documentRef.current && !disableEdit) {
      const { centerX, centerY } = convertCoordinates(documentRef.current);

      setFormFields({
        ...formFields,
        [pageNum]: new Map([
          ...formFields[pageNum],
          [
            uuidv4(),
            {
              position: {
                x: centerX - 40,
                y: centerY - 15,
                width: 80,
                height: 30,
              },
              groupId: currentGroup,
              type: FieldType.Text,
            },
          ],
        ]),
      });
    }
  };

  const handleAddCheckbox = () => {
    if (fieldGroups.size > 0 && documentRef.current && !disableEdit) {
      const { centerX, centerY } = convertCoordinates(documentRef.current);

      setFormFields({
        ...formFields,
        [pageNum]: new Map([
          ...formFields[pageNum],
          [
            uuidv4(),
            {
              position: {
                x: centerX - 40,
                y: centerY - 15,
                width: 10,
                height: 10,
              },
              groupId: currentGroup,
              type: FieldType.Checkbox,
            },
          ],
        ]),
      });
    }
  };

  const handleRemoveField = (fieldId: string) => {
    if (disableEdit) return;

    setFormFields({
      ...formFields,
      [pageNum]: new Map(
        Array.from(formFields[pageNum]).filter(
          ([key, value]) => key !== fieldId,
        ),
      ),
    });
  };

  const handleFieldUpdate = (
    groupId: string,
    fieldId: string,
    pos: TextFieldPosition,
  ) => {
    if (disableEdit) return;
    setFormFields({
      ...formFields,
      [pageNum]: new Map([
        ...formFields[pageNum].set(fieldId, {
          position: pos,
          groupId: groupId,
          type: formFields[pageNum].get(fieldId)?.type ?? FieldType.Text,
        }),
      ]),
    });
  };

  const addGroup = () => {
    if (disableEdit) return;

    let newFieldGroups = new Map(fieldGroups);
    if (groupNum <= 5) {
      const myuuid = uuidv4();
      newFieldGroups.set(myuuid, {
        border: groupColors[groupNum][0],
        background: groupColors[groupNum][1],
      });
      setFieldGroups(newFieldGroups);
      setGroupNum(groupNum + 1);
      setCurrentGroup(myuuid);
    }
  };

  // converts HTML web coordinates to PDF coordinates
  const convertCoordinates = (container: HTMLDivElement) => {
    const { scrollLeft, scrollTop, clientWidth, clientHeight } = container;
    const centerX = scrollLeft + clientWidth / 2;
    const centerY = scrollTop + clientHeight / 2;
    return { centerX, centerY };
  };

  return (
    <Box
      background="white"
      borderRadius="12px"
      width="100%"
      display="flex"
      flexDir="column"
      gap="20px"
    >
      {!disableEdit && (
        <Box display="flex" gap="12px">
          {Array.from(fieldGroups.entries()).map(
            ([key, _]: [string, any], index: number) => (
              <Button
                key={index}
                onClick={() => setCurrentGroup(key)}
                variant={'solid'}
                border={'solid 1px'}
                backgroundColor={
                  currentGroup === key ? groupColors[index][1] : 'white'
                }
                borderColor={groupColors[index][0]}
                textColor={groupColors[index][0]}
              >
                Group {index + 1}
              </Button>
            ),
          )}

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
      )}
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
            zIndex={1}
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
              isDisabled={fieldGroups.size == 0 || disableEdit}
              onClick={handleAddTextField}
            >
              <div>{TextIcon}</div>
            </Button>
            <Button
              position="relative"
              width="40px"
              height="40px"
              backgroundColor="white"
              borderRadius="4px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              isDisabled={fieldGroups.size == 0 || disableEdit}
              onClick={handleAddCheckbox}
            >
              <div>{Checkbox}</div>
            </Button>
          </Box>

          <Box
            position="absolute"
            right="24px"
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
          ></Box>
          <Box
            height="474px"
            width="800px"
            overflow="scroll"
            ref={documentRef}
            display="flex"
            flexDirection="column"
          >
            <Document
              file={pdfUrl}
              onLoadSuccess={(data) => {
                setTotalPages(data.numPages);
                setFormFields(
                  Array.from({ length: data.numPages }).reduce<FormFields>(
                    (acc, _, i) => {
                      if (formFields[i]) {
                        acc[i] = formFields[i];
                      } else {
                        acc[i] = new Map();
                      }
                      return acc;
                    },
                    {},
                  ),
                );
              }}
            >
              <Page
                renderAnnotationLayer={false}
                renderTextLayer={false}
                pageNumber={pageNum + 1}
                width={1000}
              >
                {formFields[pageNum] &&
                  Array.from(formFields[pageNum].entries()).map(
                    ([fieldId, { position, groupId }], index) => (
                      <DraggableTextFactory
                        type={
                          formFields[pageNum].get(fieldId)?.type ??
                          FieldType.Text
                        }
                        onMouseDown={(e: MouseEvent) => {
                          setSelectedField(fieldId);
                        }}
                        currentPosition={{
                          x: position.x * scale,
                          y: position.y * scale,
                          width: position.width * scale,
                          height: position.height * scale,
                        }}
                        onRemove={() => {
                          handleRemoveField(fieldId);
                        }}
                        key={index}
                        color={fieldGroups.get(groupId)?.background ?? '#000'}
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
                        disableEdit={disableEdit}
                        deleteActive={selectedField === fieldId}
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
