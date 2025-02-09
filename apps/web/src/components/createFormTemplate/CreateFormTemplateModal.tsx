import {
  Box,
  Text,
  Button,
  List,
  Skeleton,
  Heading,
  Flex,
  Input,
  Field,
} from '@chakra-ui/react';
import { AddIcon, UploadForm } from '@web/static/icons.tsx';
import { Reorder } from 'framer-motion';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SignatureField } from './SignatureField.tsx';
import { TempSignatureField } from './types.ts';
import { v4 as uuidv4 } from 'uuid';
import { queryClient } from '@web/pages/_app.tsx';
import { useBlob } from '@web/hooks/useBlob.ts';
import {
  formTemplatesControllerCreateMutation,
  formTemplatesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen.ts';
import {
  DialogBody,
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '../ui/dialog.tsx';
import { toaster, Toaster } from '../ui/toaster.tsx';

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

  const createFormTemplateMutation = useMutation({
    ...formTemplatesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
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
        body: {
          name: formTemplateName,
          formDocLink: blob.url,
          signatureFields: signatureFields.map((signatureField, i) => {
            return {
              name: signatureField.value,
              order: i,
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
    setSignatureFields([]);
    onCloseCreateFormTemplate();
    clearLocalBlob();
  };

  return (
    <DialogRoot
      open={isCreateFormTemplateOpen}
      onOpenChange={_handleModalClose}
    >
      <Toaster />
      <DialogBackdrop backdropFilter="blur(2px)" />
      <DialogContent minWidth="936px" minHeight="761px" padding="20px">
        <DialogCloseTrigger />
        <DialogHeader>
          <Heading as="h1">Create Form Template</Heading>
        </DialogHeader>
        <DialogBody>
          <Flex gap="30px">
            <Box flex="1">
              <Box>
                <Heading as="h3">Form Name</Heading>
                <Field.Root invalid={isFormTemplateNameInvalid}>
                  <Field.Label>
                    "Field Template"
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    value={formTemplateName}
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
                  <Field.HelperText />
                  <Field.ErrorText>This field is required</Field.ErrorText>
                </Field.Root>
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
                <List.Root asChild>
                  <Reorder.Group
                    spacing={2}
                    axis="y"
                    values={signatureFields}
                    onReorder={setSignatureFields}
                    mt="20px"
                  ></Reorder.Group>
                  {signatureFields.map((signatureField) => (
                    <List.Item asChild>
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
                    </List.Item>
                  ))}
                </List.Root>
                <Button
                  variant="ghost"
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
                  <AddIcon
                    fill="#4C658A"
                    _groupHover={{ fill: 'var(--chakra-colors-gray-500)' }}
                  />
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
        </DialogBody>
        <DialogFooter>
          <Button
            backgroundColor="#4C658A"
            css={{ '--color': 'white' }}
            width="161px"
            height="40px"
            disabled={
              !hasLocalBlob ||
              isFormTemplateNameInvalid ||
              signatureFields.length == 0 ||
              signatureFields.some((field) => field.value === '')
            }
            onClick={(_) => {
              toaster.promise(_submitFormTemplate(), {
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
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
