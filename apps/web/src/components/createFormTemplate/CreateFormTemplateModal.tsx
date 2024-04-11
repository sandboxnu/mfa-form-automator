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
import { CreateFormTemplateDto, FormTemplatesService } from '@web/client';
import { AddIcon, UploadForm } from '@web/static/icons';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SignatureField } from './SignatureField';
import { TempSignatureField } from './types';
import { v4 as uuidv4 } from 'uuid';
import { queryClient } from '@web/pages/_app';
import { storage } from '@web/services/storage.service';

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

  const [pdf, setPdf] = useState<string | ArrayBuffer | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const toast = useToast();

  const createFormTemplateMutation = useMutation({
    mutationFn: async (newFormTemplate: CreateFormTemplateDto) => {
      return FormTemplatesService.formTemplatesControllerCreate(
        newFormTemplate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api', 'form-templates'] });
    },
  });

  const deleteSignatureField = (id: string) => {
    let newSignatureFields = signatureFields.filter((item) => {
      return item.id !== id;
    });
    setSignatureFields(newSignatureFields);
  };

  const handleChange = (newSignatureField: TempSignatureField) => {
    let tempSignatureFields = signatureFields.slice(0);
    tempSignatureFields.filter(
      (value) => value.id === newSignatureField.id,
    )[0].value = newSignatureField.value;
    setSignatureFields(tempSignatureFields);
  };

  const submitFormTemplate = async () => {
    if (!pdfFile) {
      throw new Error('No PDF file uploaded');
    }
    const uuid = uuidv4();
    createFormTemplateMutation
      .mutateAsync({
        name: formTemplateName,
        formDocLink: formTemplateName.replaceAll(' ', '_') + '_' + uuid,
        signatureFields: signatureFields.map((signatureField, i) => {
          return {
            name: signatureField.value,
            order: i,
          };
        }),
      })
      .then(async (response) => {
        handleModalClose();
        if (pdfFile) {
          // change to storage.uploadBlob when storage is set up
          await storage.uploadBlob(
            pdfFile,
            response.name.replaceAll(' ', '_') + '_' + uuid,
          );
        }
        return response;
      })
      .catch((e) => {
        throw e;
      });
  };

  const handleModalClose = () => {
    setFormTemplateName('New Form Template');
    setSignatureFields([]);
    onCloseCreateFormTemplate();
    setPdf(null);
    setPdfName(null);
    setPdfFile(null);
  };

  const handlePdfSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!e.target.files) return;
    try {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPdf(url);
      setPdfName(file.name);
      setPdfFile(file);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal isOpen={isCreateFormTemplateOpen} onClose={handleModalClose}>
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
                    onChange={(e) => handlePdfSubmit(e)}
                  />
                  {pdfName && (
                    <span
                      style={{
                        fontSize: '17px',
                        fontStyle: 'italic',
                        fontWeight: '400',
                        lineHeight: 'normal',
                        paddingLeft: '15px',
                      }}
                    >
                      {pdfName}
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
                        handleChange={handleChange}
                        handleDelete={deleteSignatureField}
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
              {!pdf && (
                <Skeleton mt="16px" w="400px" h="500px" background="gray" />
              )}
              {pdf && (
                <embed
                  src={pdf as string}
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
              !pdf ||
              !pdfName ||
              !pdfFile ||
              isFormTemplateNameInvalid ||
              signatureFields.length == 0 ||
              signatureFields.some((field) => field.value === '')
            }
            onClick={async (e) => {
              toast.promise(submitFormTemplate(), {
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
