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
} from '@chakra-ui/react';
import { CreateFormTemplateDto, FormTemplatesService } from '@web/client';
import { AddIcon, UploadForm } from '@web/static/icons';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FormTemplateTitle } from './FormTemplateTitle';
import { SignatureField } from './SignatureField';
import { TempSignatureField } from './types';
import { v4 as uuidv4 } from 'uuid';

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
  const [signatureFields, setSignatureFields] = useState<TempSignatureField[]>([
    { id: 'v-ew-v-23v-v-v2bb-b-2b2b', value: 'Leadership Team Member' },
    { id: 'f232-f32f32f2-f23-f23-f2f', value: 'Director' },
    { id: 'vf0efe0eff-fff23f2-ff-2f2f', value: 'Senior Director' },
  ]);

  const createFormTemplateMutation = useMutation({
    mutationFn: (newFormTemplate: CreateFormTemplateDto) => {
      return FormTemplatesService.formTemplatesControllerCreate(
        newFormTemplate,
      );
    },
  });

  const deleteSignatureField = (id: string) => {
    let newSignatureFields = signatureFields.filter((item) => {
      return item.id !== id;
    });
    setSignatureFields(newSignatureFields);
  };

  const handleChange = (newSignatureField: TempSignatureField) => {
    let tempSignatureFields = [...signatureFields];
    tempSignatureFields.filter(
      (value) => value.id === newSignatureField.id,
    )[0] = newSignatureField;
    setSignatureFields(tempSignatureFields);
  };

  return (
    <Modal
      isOpen={isCreateFormTemplateOpen}
      onClose={onCloseCreateFormTemplate}
    >
      <ModalOverlay />
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
            <Text fontFamily="Hanken Grotesk" fontSize="19px" fontWeight="400">
              Title
            </Text>
            <FormTemplateTitle
              title={formTemplateName}
              handleChange={setFormTemplateName}
            />
            <Text
              pt="40px"
              pb="8px"
              fontFamily="Hanken Grotesk"
              fontSize="19px"
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
            <Grid templateColumns="repeat(2, 1fr)" gap={122} pt="30px">
              <GridItem w="100%">
                <Text
                  fontFamily="Hanken Grotesk"
                  fontSize="19px"
                  fontWeight="700"
                  pb="22px"
                >
                  Form Preview
                </Text>
                <Box w="386px" h="500px" background="gray" />
              </GridItem>
              <GridItem w="100%">
                <Text
                  fontFamily="Hanken Grotesk"
                  fontSize="19px"
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
                  form.
                </Text>
                <List
                  as={Reorder.Group}
                  overflowY="auto"
                  maxH="350px"
                  spacing={2}
                  axis="y"
                  values={signatureFields}
                  onReorder={(a: any[]) => {
                    console.log(a);
                    setSignatureFields(a);
                  }}
                  mt="16px"
                  mb="10px"
                  pr="5px"
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
                  leftIcon={<AddIcon />}
                  padding="0px"
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
                  >
                    Add signature field
                  </Text>
                </Button>
              </GridItem>
            </Grid>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onCloseCreateFormTemplate}>
            Cancel
          </Button>
          <Button
            color="#4C658A"
            onClick={() => {
              createFormTemplateMutation.mutate({
                name: formTemplateName,
                formDocLink: 'mfa.org',
                signatureFields: signatureFields.map((signatureField, i) => {
                  return {
                    name: signatureField.value,
                    order: i,
                  };
                }),
              });
              onCloseCreateFormTemplate();
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
