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
import { SignatureField } from './SignatureField';
import { TempSignatureField } from './types';
import { v4 as uuidv4 } from 'uuid';
import { queryClient } from '@web/pages/_app';
import { useBlob } from '@web/hooks/useBlob';
import {
  CreateFormTemplateDto,
  formTemplatesControllerCreate,
} from '@web/client';
import { client } from '@web/client/client.gen';

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
  const [signatureFields, setSignatureFields] = useState<TempSignatureField[]>(
    [],
  );
  let isFormTemplateNameInvalid = formTemplateName === '';
  const {
    inputFileRef,
    uploadFileRef,
    uploadLocalFile,
    clearLocalBlob,
    localBlobData: { blob: localBlob, url: localBlobUrl, name: localBlobName },
    hasLocalBlob,
  } = useBlob();

  const toast = useToast();

  const createFormTemplateMutation = useMutation({
    mutationFn: async (newFormTemplate: CreateFormTemplateDto) => {
      return formTemplatesControllerCreate({
        client: client,
        body: newFormTemplate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api', 'form-templates'] });
    },
  });

  /**
   * Delete a signature field given an id
   */
  const _deleteSignatureField = (id: string) => {
    let newSignatureFields = signatureFields.filter((item) => {
      return item.id !== id;
    });
    setSignatureFields(newSignatureFields);
  };

  /**
   * Add a signature field
   */
  const _handleChange = (newSignatureField: TempSignatureField) => {
    let tempSignatureFields = signatureFields.slice(0);
    tempSignatureFields.filter(
      (value) => value.id === newSignatureField.id,
    )[0].value = newSignatureField.value;
    setSignatureFields(tempSignatureFields);
  };

  /**
   * Upload and create a form template
   */
  const _submitFormTemplate = async () => {
    if (!hasLocalBlob) {
      throw new Error('No PDF file uploaded');
    }

    const blob = await uploadFileRef();
    createFormTemplateMutation
      .mutateAsync({
        name: formTemplateName,
        formDocLink: blob.url,
        signatureFields: signatureFields.map((signatureField, i) => {
          return {
            name: signatureField.value,
            order: i,
          };
        }),
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
    setSignatureFields([]);
    onCloseCreateFormTemplate();
    clearLocalBlob();
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
                    onChange={(e) => uploadLocalFile(e.target?.files?.[0])}
                  />
                  {hasLocalBlob && (
                    <span
                      style={{
                        fontSize: '17px',
                        fontStyle: 'italic',
                        fontWeight: '400',
                        lineHeight: 'normal',
                        paddingLeft: '15px',
                      }}
                    >
                      {localBlobName}
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
                  values={signatureFields}
                  onReorder={setSignatureFields}
                  mt="20px"
                >
                  {signatureFields.map((signatureField) => (
                    <Reorder.Item
                      key={signatureField.id}
                      value={signatureField}
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
                      <SignatureField
                        field={signatureField}
                        handleChange={_handleChange}
                        handleDelete={_deleteSignatureField}
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
                  mt={signatureFields.length > 0 ? '14px' : '0px'}
                  padding="0px"
                  data-group
                  _hover={{ bg: 'transparent' }}
                  onClick={() => {
                    let currentSignatureFields = signatureFields.slice(0);
                    currentSignatureFields.push({
                      id: uuidv4(),
                      value: '',
                    });
                    setSignatureFields(currentSignatureFields);
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
              {!hasLocalBlob && (
                <Skeleton mt="16px" w="400px" h="500px" background="gray" />
              )}
              {hasLocalBlob && (
                <embed
                  src={localBlobUrl as string}
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
              !hasLocalBlob ||
              isFormTemplateNameInvalid ||
              signatureFields.length == 0 ||
              signatureFields.some((field) => field.value === '')
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
