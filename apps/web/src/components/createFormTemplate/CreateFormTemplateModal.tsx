import {
  Box,
  Text,
  Button,
  List,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useToast,
  Skeleton,
  Heading,
  ModalHeader,
  Flex,
  Input,
} from '@chakra-ui/react';
import { AddIcon, UploadForm } from '@web/static/icons';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FieldGroup } from './FieldGroup';
import { TempFieldGroup } from './types';
import { v4 as uuidv4 } from 'uuid';
import { queryClient } from '@web/pages/_app';
import { useBlob } from '@web/hooks/useBlob';
import {
  formTemplatesControllerCreateMutation,
  formTemplatesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';

const variants = {
  notDragging: {
    zIndex: 0,
    boxShadow: 'none',
    background: '#EFEFEF',
  },
  dragging: {
    zIndex: 1,
    boxShadow: 'var(--chakra-shadows-lg)',
    background: '#C0CDDF',
  },
};

/**
 * @param isCreateFormTemplateOpen - boolean to determine if the modal is open
 * @param onCloseCreateFormTemplate - function to close the modal
 * @returns  a modal to create a form template
 */
export const CreateFormTemplateModal = ({
  isCreateFormTemplateOpen,
  onCloseCreateFormTemplate,
}: {
  isCreateFormTemplateOpen: boolean;
  onCloseCreateFormTemplate: () => void;
}) => {
  const [formTemplateName, setFormTemplateName] =
    useState<string>('New Form Template');
  const [fieldGroups, setFieldGroups] = useState<TempFieldGroup[]>([]);

  let isFormTemplateNameInvalid = formTemplateName === '';
  const { inputFileRef, blob, setBlob } = useBlob();

  const toast = useToast();

  const createFormTemplateMutation = useMutation({
    ...formTemplatesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
    },
  });

  /**
   * Delete a field group given an id
   */
  const _deleteFieldGroup = (id: string) => {
    let newFieldGroups = fieldGroups.filter((item) => {
      return item.id !== id;
    });
    setFieldGroups(newFieldGroups);
  };

  /**
   * Add a field group
   */
  const _handleChange = (newFieldGroup: TempFieldGroup) => {
    let tempFieldGroups = fieldGroups.slice(0);
    tempFieldGroups.filter((value) => value.id === newFieldGroup.id)[0].value =
      newFieldGroup.value;
    setFieldGroups(tempFieldGroups);
  };

  /**
   * Upload and create a form template
   */
  const _submitFormTemplate = async () => {
    if (!blob) {
      throw new Error('No PDF file uploaded');
    }
    createFormTemplateMutation
      .mutateAsync({
        body: {
          name: formTemplateName,
          file: blob,
          fieldGroups: fieldGroups.map((fieldGroup, i) => {
            return {
              name: fieldGroup.value,
              order: i,
              // TODO: THESE SHOULD BE SPECIFIED IN THE FORM TEMPLATE CREATION
              templateBoxes: [],
              formTemplateId: '',
            };
          }),
        },
      })
      .then((response) => {
        _handleModalClose();
        return response;
      })
      .catch((e) => {
        throw e;
      });
  };

  /**
   * Close the modal and reset the form template name, signature fields, and pdf
   */
  const _handleModalClose = () => {
    setFormTemplateName('New Form Template');
    setFieldGroups([]);
    onCloseCreateFormTemplate();
    setBlob(null);
  };

  return (
    <Modal isOpen={isCreateFormTemplateOpen} onClose={_handleModalClose}>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent minWidth="936px" minHeight="761px" padding="20px">
        <ModalCloseButton />
        <ModalHeader>
          <Heading as="h1">Create Form Template</Heading>
        </ModalHeader>
        <ModalBody>
          <Flex gap="30px">
            <Box flex="1">
              <Box>
                <Heading as="h3">Form Name</Heading>
                <Input
                  value={formTemplateName}
                  isInvalid={isFormTemplateNameInvalid}
                  onChange={(e) => setFormTemplateName(e.target.value)}
                  placeholder="Form Name"
                  fontSize="16px"
                  paddingLeft="11px"
                  paddingRight="11px"
                  fontWeight="400px"
                  width="386px"
                  height="40px"
                  mt="16px"
                />
              </Box>
              <Box mt="35px">
                <Heading as="h3">Upload Form</Heading>
                <Flex alignItems={'center'} mt="16px">
                  <label
                    htmlFor="pdfInput"
                    style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: '#4C658A',
                      cursor: 'pointer',
                      paddingLeft: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #4C658A',
                      borderRadius: '10px',
                      padding: '8px',
                    }}
                  >
                    <UploadForm
                      color="#4C658A"
                      width="24px"
                      height="24px"
                      aria-label="Upload Icon"
                    />
                    <span
                      style={{
                        paddingLeft: '5px',
                      }}
                    >
                      Upload File
                    </span>
                  </label>

                  <input
                    type="file"
                    id="pdfInput"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    ref={inputFileRef}
                    onChange={(e) =>
                      e.target?.files?.[0] && setBlob(e.target?.files?.[0])
                    }
                  />
                  {blob && (
                    <span
                      style={{
                        fontSize: '17px',
                        fontStyle: 'italic',
                        fontWeight: '400',
                        lineHeight: 'normal',
                        paddingLeft: '15px',
                      }}
                    >
                      {blob.name}
                    </span>
                  )}
                </Flex>
              </Box>
              <Box mt="35px">
                <Heading as="h3">Add Signature Fields</Heading>
                <Text fontSize="15px" fontWeight="400" mt="14px">
                  Enter the role titles of employees that will need to sign this
                  form, and set the order it will be signed in.
                </Text>
                <List
                  as={Reorder.Group}
                  spacing={2}
                  axis="y"
                  values={fieldGroups}
                  onReorder={setFieldGroups}
                  mt="20px"
                >
                  {fieldGroups.map((fieldGroup) => (
                    <Reorder.Item
                      key={fieldGroup.id}
                      value={fieldGroup}
                      dragTransition={{
                        bounceStiffness: 600,
                      }}
                      variants={variants}
                      initial="notDragging"
                      whileDrag="dragging"
                      style={{
                        padding: '5px',
                        borderRadius: '8px',
                      }}
                    >
                      <FieldGroup
                        fieldGroup={fieldGroup}
                        handleChange={_handleChange}
                        handleDelete={_deleteFieldGroup}
                      />
                    </Reorder.Item>
                  ))}
                </List>
                <Button
                  variant="ghost"
                  leftIcon={
                    <AddIcon
                      fill="#4C658A"
                      _groupHover={{ fill: 'var(--chakra-colors-gray-500)' }}
                    />
                  }
                  mt={fieldGroups.length > 0 ? '14px' : '0px'}
                  padding="0px"
                  data-group
                  _hover={{ bg: 'transparent' }}
                  onClick={() => {
                    let currentFieldGroups = fieldGroups.slice(0);
                    currentFieldGroups.push({
                      id: uuidv4(),
                      value: '',
                    });
                    setFieldGroups(currentFieldGroups);
                  }}
                >
                  <Text
                    fontSize="16px"
                    fontWeight="400"
                    color="#4C658A"
                    _groupHover={{ color: 'var(--chakra-colors-gray-500)' }}
                  >
                    Add signature field
                  </Text>
                </Button>
              </Box>
            </Box>
            <Box flex="1">
              <Heading as="h3">Form Preview</Heading>
              {!blob && (
                <Skeleton mt="16px" w="400px" h="500px" background="gray" />
              )}
              {blob && (
                <embed
                  src={URL.createObjectURL(blob)}
                  type="application/pdf"
                  width="400px"
                  height="500px"
                  style={{
                    marginTop: '16px',
                    border: '3px solid black',
                    borderRadius: '8px',
                  }}
                />
              )}
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor="#4C658A"
            textColor="white"
            width="161px"
            height="40px"
            isDisabled={
              !blob ||
              isFormTemplateNameInvalid ||
              fieldGroups.length == 0 ||
              fieldGroups.some((field) => field.value === '')
            }
            onClick={(_) => {
              toast.promise(_submitFormTemplate(), {
                success: {
                  title: 'Success',
                  description: 'Form template created',
                },
                error: {
                  title: 'Error',
                  description: 'Unable to create form template',
                },
                loading: {
                  title: 'Pending',
                  description: 'Please wait',
                },
              });
            }}
          >
            Create Template
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
