import { Box, Button, Text, Spacer } from '@chakra-ui/react';
import {
  Checkbox,
  LeftArrowIcon,
  PlusSign,
  RightArrowIcon,
  SignatureIcon,
  TextIcon,
} from 'apps/web/src/static/icons';
import { useRef, useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';
import {
  FieldGroups,
  FieldType,
  FormFields,
  TextFieldPosition,
} from '../types';
import DraggableBoxFactory from './DraggableBoxFactory';
import { debounce } from '@web/utils/misc';
import { groupColors } from '@web/utils/formTemplateUtils';
import { PDF_HEIGHT_PX, PDF_WIDTH_PX } from '../utils';

export const FormEditor = ({
  formTemplateName,
  formTemplateDimensions,
  pdfFile,
  disableEdit,
  formFields,
  setFormFields,
  fieldGroups,
  setFieldGroups,
  showNav = true,
}: {
  formTemplateName: string;
  formTemplateDimensions: {
    width: number;
    height: number;
  };
  pdfFile: File | null;
  disableEdit: boolean;
  formFields: FormFields;
  setFormFields: (fields: FormFields) => void;
  fieldGroups: FieldGroups;
  setFieldGroups: (groups: FieldGroups) => void;
  showNav?: boolean;
}) => {
  const [currentGroup, setCurrentGroup] = useState<string>(
    fieldGroups.keys().next().value ?? '',
  );
  const [pageNum, setPageNum] = useState(1); // Keep 1-based for display purposes
  const [totalPages, setTotalPages] = useState(0);
  const documentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [groupNum, setGroupNum] = useState(fieldGroups.size);
  const [selectedField, setSelectedField] = useState<string | null>();
  const [lastClickTime, setLastClickTime] = useState(0);

  const [displayDimensions, setDisplayDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const heightScale =
    displayDimensions.height /
    (formTemplateDimensions?.height ?? PDF_HEIGHT_PX);
  const widthScale =
    displayDimensions.width / (formTemplateDimensions?.width ?? PDF_WIDTH_PX);

  // Update display dimensions when page changes or window resizes
  useEffect(() => {
    const updateDisplayDimensions = () => {
      if (documentRef.current) {
        const rect = documentRef.current.getBoundingClientRect();
        setDisplayDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDisplayDimensions();

    // Add resize event listener
    window.addEventListener('resize', updateDisplayDimensions);

    return () => {
      window.removeEventListener('resize', updateDisplayDimensions);
    };
  }, [pageNum]);

  // Handle clicks on the document to clear selected field when clicking outside
  const handleDocumentClick = (event: React.MouseEvent) => {
    // If the click originated from a field component, it will be handled by that component
    // Ignore clicks on add field buttons
    // Otherwise, clear the selected field
    if (
      (event.target as HTMLElement).closest('.chakra-button') === null &&
      (event.target as HTMLElement).closest('.field-box') === null
    ) {
      setSelectedField(null);
    }
  };

  // Initialize pageRefs when totalPages changes
  useEffect(() => {
    pageRefs.current = Array(totalPages).fill(null);
  }, [totalPages]);

  // Track current page on scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const handleScroll = debounce(() => {
      // Find which page is most visible in the viewport
      let bestVisiblePage = pageNum;
      let maxVisibleArea = 0;

      pageRefs.current.forEach((pageRef, index) => {
        if (!pageRef) return;

        const pageRect = pageRef.getBoundingClientRect();
        const containerRect = scrollContainer.getBoundingClientRect();

        // Calculate visible area of the page
        const visibleTop = Math.max(containerRect.top, pageRect.top);
        const visibleBottom = Math.min(containerRect.bottom, pageRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > maxVisibleArea) {
          maxVisibleArea = visibleHeight;
          bestVisiblePage = index + 1; // +1 because we display pages as 1-indexed
        }
      });

      if (bestVisiblePage !== pageNum) {
        setPageNum(bestVisiblePage);
      }
    }, 100);

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [pageNum, totalPages]);

  // Convert 1-based pageNum to 0-based index for formFields
  const pageIndex = pageNum - 1;

  const handleAddTextField = () => {
    if (fieldGroups.size > 0 && documentRef.current && !disableEdit) {
      const id = uuidv4();
      setFormFields({
        ...formFields,
        [pageIndex]: new Map([
          ...(formFields[pageIndex] || new Map()),
          [
            id,
            {
              position: {
                x: (formTemplateDimensions?.width ?? PDF_WIDTH_PX) / 2 - 40,
                y: (formTemplateDimensions?.height ?? PDF_HEIGHT_PX) / 2 - 15,
                width: 240,
                height: 90,
              },
              groupId: currentGroup,
              type: FieldType.TEXT_FIELD,
            },
          ],
        ]),
      });
      setSelectedField(id);
    }
  };

  const handleAddCheckbox = () => {
    if (fieldGroups.size > 0 && documentRef.current && !disableEdit) {
      const id = uuidv4();
      setFormFields({
        ...formFields,
        [pageIndex]: new Map([
          ...(formFields[pageIndex] || new Map()),
          [
            id,
            {
              position: {
                x: (formTemplateDimensions?.width ?? PDF_WIDTH_PX) / 2 - 40,
                y: (formTemplateDimensions?.width ?? PDF_WIDTH_PX) / 2 - 15,
                width: 40,
                height: 40,
              },
              groupId: currentGroup,
              type: FieldType.CHECKBOX,
            },
          ],
        ]),
      });
      setSelectedField(id);
    }
  };

  const handleAddSignatureField = () => {
    if (fieldGroups.size > 0 && documentRef.current && !disableEdit) {
      const id = uuidv4();
      setFormFields({
        ...formFields,
        [pageIndex]: new Map([
          ...(formFields[pageIndex] || new Map()),
          [
            id,
            {
              position: {
                x: (formTemplateDimensions?.width ?? PDF_WIDTH_PX) / 2 - 75,
                y: (formTemplateDimensions?.height ?? PDF_HEIGHT_PX) / 2 - 25,
                width: 480,
                height: 160,
              },
              groupId: currentGroup,
              type: FieldType.SIGNATURE,
            },
          ],
        ]),
      });
      setSelectedField(id);
    }
  };

  const handleRemoveField = (fieldId: string) => {
    if (disableEdit) return;

    setFormFields({
      ...formFields,
      [pageIndex]: new Map(
        Array.from(formFields[pageIndex] || new Map()).filter(
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
      [pageIndex]: new Map([
        ...(formFields[pageIndex] || new Map()).set(fieldId, {
          position: pos,
          groupId: groupId,
          type:
            formFields[pageIndex]?.get(fieldId)?.type ?? FieldType.TEXT_FIELD,
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
        groupName: `Group ${groupNum + 1}`,
      });
      setFieldGroups(newFieldGroups);
      setGroupNum(groupNum + 1);
      setCurrentGroup(myuuid);
    }
  };

  // Function to handle manual page navigation
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPageNum(pageNumber);
      const pageRef = pageRefs.current[pageNumber - 1];
      if (pageRef && scrollContainerRef.current) {
        const now = Date.now();
        const isRapidClick = now - lastClickTime < 300; // Consider clicks within 300ms as rapid
        setLastClickTime(now);

        // Use immediate scrolling for rapid clicks, smooth scrolling otherwise
        pageRef.scrollIntoView({
          behavior: isRapidClick ? 'auto' : 'smooth',
        });
      }
    }
  };

  return (
    <Box
      background="white"
      borderRadius="12px"
      display="flex"
      flexDir="column"
      gap="20px"
      width="100%"
      onClick={handleDocumentClick}
    >
      {!disableEdit && (
        <Box display="flex" gap="12px" justifyContent={'flex-start'}>
          {Array.from(fieldGroups.entries()).map(
            ([key, _]: [string, any], index: number) => (
              <Button
                key={index}
                onClick={() => setCurrentGroup(key)}
                backgroundColor={
                  currentGroup === key ? groupColors[index][1] : '#fff'
                }
                borderColor={groupColors[index][0]}
                variant="outline"
                borderWidth="1px"
                padding="8px 12px"
                color={groupColors[index][0]}
              >
                <Text fontSize={'16px'} fontWeight={800}>
                  Group {index + 1}
                </Text>
              </Button>
            ),
          )}

          {groupNum < 5 && (
            <Button
              border="1px solid #1367EA"
              onClick={addGroup}
              w="120px"
              variant="outline"
              borderWidth="1px"
              padding="8px 12px"
            >
              {PlusSign}
              <Text
                style={{
                  fontFamily: 'Hanken Grotesk',
                  fontSize: '16px',
                  color: '#1367EA',
                  fontWeight: 800,
                }}
              >
                Add group
              </Text>
            </Button>
          )}
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
          {!disableEdit && (
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
                backgroundColor="white"
                borderRadius="4px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                disabled={fieldGroups.size == 0 || disableEdit}
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
                disabled={fieldGroups.size == 0 || disableEdit}
                onClick={handleAddCheckbox}
              >
                <div>{Checkbox}</div>
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
                disabled={fieldGroups.size == 0 || disableEdit}
                onClick={handleAddSignatureField}
              >
                <div>{SignatureIcon}</div>
              </Button>
            </Box>
          )}
          <div
            style={{
              overflowY: 'auto',
              maxHeight: '800px',
              padding: '12px',
              background: '#F0F0F0',
            }}
          >
            <Box
              height="474px"
              overflow="scroll"
              display="flex"
              flexDirection="column"
              ref={scrollContainerRef}
            >
              <Document
                file={pdfFile}
                onLoadSuccess={(data) => {
                  setTotalPages(data.numPages);
                  setPageNum(1); // Reset to first page when document loads

                  // Initialize form fields with 0-based indexing
                  setFormFields(
                    Array.from({ length: data.numPages }).reduce<FormFields>(
                      (acc, _, i) => {
                        if (formFields[i]) {
                          // Use 0-based index
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
                {Array.from(new Array(totalPages), (_, index) => (
                  <div
                    key={`page_container_${index + 1}`}
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
                      inputRef={index + 1 === pageNum ? documentRef : null}
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      pageNumber={index + 1}
                      onRenderSuccess={() => {
                        // Set the form dimensions based on the PDF page size
                        if (index === 0 && documentRef.current) {
                          const rect =
                            documentRef.current.getBoundingClientRect();
                          setDisplayDimensions({
                            width: rect.width,
                            height: rect.height,
                          });
                        }
                      }}
                    >
                      {formFields[index] &&
                        Array.from(formFields[index].entries()).map(
                          (
                            [fieldId, { position, groupId, type }],
                            fieldIndex,
                          ) => {
                            // positioning and dimensions should be adjusted from stored values to fit scaled container
                            // we'll use a reference of PDF_WIDTH_PX px	by PDF_HEIGHT_PX px
                            // Calculate the position based on the container dimensions
                            const scaledPosition = {
                              x: position.x * widthScale,
                              y: position.y * heightScale,
                            };
                            const scaledDimensions = {
                              width: position.width * widthScale,
                              height: position.height * heightScale,
                            };

                            if (!documentRef.current) {
                              return <></>;
                            }

                            return (
                              <DraggableBoxFactory
                                type={type ?? FieldType.TEXT_FIELD}
                                currentPosition={{
                                  x: scaledPosition.x,
                                  y: scaledPosition.y,
                                  width: scaledDimensions.width,
                                  height: scaledDimensions.height,
                                }}
                                onRemove={() => {
                                  handleRemoveField(fieldId);
                                }}
                                key={fieldIndex}
                                color={
                                  fieldGroups.get(groupId)?.background ?? '#000'
                                }
                                onStop={(
                                  e: DraggableEvent,
                                  data: DraggableData,
                                ) => {
                                  setSelectedField(fieldId);
                                  handleFieldUpdate(groupId, fieldId, {
                                    width: position.width,
                                    height: position.height,
                                    x: data.x / widthScale,
                                    y: data.y / heightScale,
                                  });
                                }}
                                onResizeStop={(
                                  e: MouseEvent | TouchEvent,
                                  dir,
                                  elementRef,
                                  delta,
                                  pos,
                                ) => {
                                  setSelectedField(fieldId);

                                  let newWidth = parseFloat(
                                    elementRef.style.width,
                                  );
                                  let newHeight = parseFloat(
                                    elementRef.style.height,
                                  );

                                  // Convert dimensions back to original scale when storing
                                  handleFieldUpdate(groupId, fieldId, {
                                    width: newWidth / widthScale,
                                    height: newHeight / heightScale,
                                    x: position.x,
                                    y: position.y,
                                  });
                                }}
                                disableEdit={disableEdit}
                                selected={selectedField === fieldId}
                                highlighted={selectedField === fieldId}
                              />
                            );
                          },
                        )}
                    </Page>
                  </div>
                ))}
              </Document>
            </Box>
          </div>
        </Box>
      </Box>

      {/* Page indicator and navigation controls with arrows */}
      {showNav && (
        <Box
          mt="8px"
          display="flex"
          alignItems="center"
          spaceX="16px"
          width="100%"
        >
          <Spacer />
          <Button
            bg="white"
            borderRadius="6px"
            fontWeight="500"
            p={2}
            minW="20px"
            height="40px"
            _hover={{ bg: '#F3F6F8' }}
            disabled={pageNum <= 1}
            onClick={() => goToPage(pageNum - 1)}
            aria-label="Previous page"
          >
            <LeftArrowIcon boxSize={6} fill="#1367EA" />
          </Button>

          <Text fontSize="14px" color="#5A6474">
            Page {pageNum} of {totalPages}
          </Text>

          <Button
            bg="white"
            borderRadius="6px"
            fontWeight="500"
            p={2}
            minW="20px"
            height="40px"
            _hover={{ bg: '#F3F6F8' }}
            disabled={pageNum >= totalPages}
            onClick={() => goToPage(pageNum + 1)}
            aria-label="Next page"
          >
            <RightArrowIcon boxSize={6} />
          </Button>
          <Spacer />
        </Box>
      )}
    </Box>
  );
};
