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
  Input,
  useToast,
  Skeleton,
  ModalHeader,
  Flex,
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
import PDFUpload from '../../components/createFormTemplate/PdfUpload';
import { Document, Page } from 'react-pdf';
import PDFViewer from './PdfViewer';

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

  const toast = useToast();

  // const bytesToUrl = (byteData: ArrayBuffer): string => {
  //   const uint8Array = new Uint8Array(byteData);
  //   const uintArray = Array.from(uint8Array);
  //   const base64EncodedData = btoa(String.fromCharCode.apply(null, uintArray));
  //   const urlSafeString = encodeURIComponent(base64EncodedData);
  //   return urlSafeString;
  // };

  const blob = new Blob([pdf!], { type: 'application/pdf' });
  if (pdf) {
    const blobUrl = URL.createObjectURL(pdf);
  }
  console.log(blobUrl);

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

  const submitFormTemplate = async () =>
    createFormTemplateMutation
      .mutateAsync({
        name: formTemplateName,
        formDocLink: 'mfa.org',
        signatureFields: signatureFields.map((signatureField, i) => {
          return {
            name: signatureField.value,
            order: i,
          };
        }),
      })
      .then((response) => {
        handleModalClose();
        return response;
      })
      .catch((e) => {
        throw e;
      });

  const handleModalClose = () => {
    setFormTemplateName('New Form Template');
    setSignatureFields([]);
    onCloseCreateFormTemplate();
  };

  return (
    <Modal isOpen={isCreateFormTemplateOpen} onClose={handleModalClose}>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent minWidth="936px" minHeight="761px" padding="20px">
        <ModalCloseButton />
        <ModalHeader>
          <Text fontWeight="800" fontSize="27px">
            Create Form Template
          </Text>
        </ModalHeader>
        <ModalBody>
          <Flex gap="30px">
            <Box flex="1">
              <Box>
                <Text fontSize="17px" fontWeight="700">
                  Form Name
                </Text>
                <Input
                  value={formTemplateName}
                  isInvalid={isFormTemplateNameInvalid}
                  onChange={(e) => setFormTemplateName(e.target.value)}
                  placeholder="Form Name"
                  fontSize="16px"
                  fontWeight="400px"
                  width="386px"
                  height="40px"
                  mt="16px"
                />
              </Box>
              <Box mt="35px">
                <Text fontSize="17px" fontWeight="700">
                  Upload Form
                </Text>
                <Button
                  width="160px"
                  height="40px"
                  borderRadius="8px"
                  border="1px"
                  background="white"
                  borderColor="#4C658A"
                  mt="16px"
                >
                  <UploadForm color="#4C658A" width="24px" height="24px" />
                  <Text
                    fontSize="17px"
                    fontWeight="700"
                    color="#4C658A"
                    pl="10px"
                  >
                    Upload Form
                  </Text>
                </Button>
              </Box>
              <Box mt="35px">
                <Text fontSize="17px" fontWeight="700">
                  Add Signature Fields
                </Text>
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
                    fontFamily="Hanken Grotesk"
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
              <Text fontSize="17px" fontWeight="700">
                Form Preview
              </Text>
              <Skeleton mt="16px" w="400px" h="500px" background="gray" />
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
