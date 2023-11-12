import {
  Box,
  Text,
  Button,
  Grid,
  GridItem,
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

  const toast = useToast();

  const createFormTemplateMutation = useMutation({
    mutationFn: async (newFormTemplate: CreateFormTemplateDto) => {
      return FormTemplatesService.formTemplatesControllerCreate(
        newFormTemplate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api/form-templates'] });
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
        onCloseCreateFormTemplate();
        return response;
      })
      .catch((e) => {
        throw e;
      });

  return (
    <Modal
      isOpen={isCreateFormTemplateOpen}
      onClose={onCloseCreateFormTemplate}
    >
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent minWidth="fit-content" height="fit-content">
        <ModalCloseButton />
        <ModalBody>
          <Box h="75vh" w="75vw">
            <Text
              fontFamily="Hanken Grotesk"
              fontWeight="800"
              fontSize="27px"
              pt="30px"
              pb="30px"
            >
              Create Form Template
            </Text>
            <Text
              fontFamily="Hanken Grotesk"
              fontSize="17px"
              fontWeight="700"
              mb="10px"
            >
              Form Name
            </Text>
            {isFormTemplateNameInvalid ? (
              <Text
                fontFamily="Hanken Grotesk"
                fontSize="12px"
                fontWeight="400"
                color="red"
              >
                Please specify a name for the form template
              </Text>
            ) : (
              <></>
            )}
            <Input
              value={formTemplateName}
              isInvalid={isFormTemplateNameInvalid}
              onChange={(e) => setFormTemplateName(e.target.value)}
              placeholder="Form Name"
              fontFamily="Hanken Grotesk"
              fontSize="16px"
              fontWeight="400px"
              width="386px"
              height="40px"
            />
            <Text
              pt="40px"
              pb="8px"
              fontFamily="Hanken Grotesk"
              fontSize="17px"
              fontWeight="700"
            >
              Upload Form
            </Text>
            <Button
              width="160px"
              height="40px"
              borderRadius="8px"
              border="1px"
              background="white"
              borderColor="#4C658A"
            >
              <UploadForm color="#4C658A" width="24px" height="24px" />
              <Text
                fontFamily="Hanken Grotesk"
                fontSize="17px"
                fontWeight="700"
                color="#4C658A"
                pl="10px"
              >
                Upload Form
              </Text>
            </Button>
            <Grid templateColumns="repeat(2, 1fr)" gap={75} pt="30px">
              <GridItem w="100%">
                <Text
                  fontFamily="Hanken Grotesk"
                  fontSize="17px"
                  fontWeight="700"
                  mb="5px"
                >
                  Form Preview
                </Text>
                <Skeleton w="386px" h="300px" background="gray" />
              </GridItem>
              <GridItem w="100%" pr="0px">
                <Text
                  fontFamily="Hanken Grotesk"
                  fontSize="17px"
                  fontWeight="700"
                >
                  Add Signature Fields
                </Text>
                <Text
                  fontFamily="Hanken Grotesk"
                  fontSize="18px"
                  fontWeight="400"
                >
                  Enter the role titles of employees that will need to sign this
                  form, and set the order it will be signed in.
                </Text>
                {signatureFields.length == 0 ? (
                  <Text
                    fontFamily="Hanken Grotesk"
                    fontSize="12px"
                    fontWeight="400"
                    color="red"
                    pt="10px"
                  >
                    At least one signature field must be present
                  </Text>
                ) : (
                  <></>
                )}
                <List
                  as={Reorder.Group}
                  overflowY="auto"
                  maxH="175px"
                  spacing={2}
                  axis="y"
                  values={signatureFields}
                  onReorder={setSignatureFields}
                  mt="16px"
                  mb="10px"
                  pr="5px"
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#4C658A',
                      borderRadius: '24px',
                    },
                  }}
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
              </GridItem>
            </Grid>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor="#4C658A"
            textColor="white"
            width="161px"
            height="40px"
            position="absolute"
            right="40px"
            bottom="32px"
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
