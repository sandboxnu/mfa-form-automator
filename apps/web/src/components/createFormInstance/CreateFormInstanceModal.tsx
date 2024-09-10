import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  Heading,
  Text,
  ModalFooter,
  Skeleton,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  HStack,
  ModalHeader,
  Button,
} from '@chakra-ui/react';
import { DropdownDownArrow, DropdownUpArrow } from '@web/static/icons';
import { chakraComponents, Select } from 'chakra-react-select';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CreateFormInstanceDto,
  FormInstancesService,
  FormTemplateEntity,
  FormTemplatesService,
  PositionsService,
} from '@web/client';
import { SignatureDropdown } from './SignatureDropdown';
import { CreateFormInstanceModalProps, Option } from './types';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { GrayPencilIcon } from '@web/static/icons';
import { useStorage } from '@web/hooks/useStorage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '@web/services/storage.service';

/**
 * @param isOpen - Modal open state
 * @param onClose - Function to close the modal
 * @returns Modal for creating a new form instance
 */
const CreateFormInstanceModal: React.FC<CreateFormInstanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const [selectedFormTemplate, setSelectedFormTemplate] =
    useState<FormTemplateEntity | null>(null);
  const { formBlob } = useStorage(selectedFormTemplate);
  const [formURL, setFormURL] = useState<string | null>(null);
  const [formTypeSelected, setFormTypeSelected] = useState(false);
  const [signaturePositions, setSignaturePositions] = useState<
    (Option | null)[]
  >([]);
  const [formName, setFormName] = useState('Create Form');
  const createFormInstanceMutation = useMutation({
    mutationFn: async (newFormInstance: CreateFormInstanceDto) => {
      return FormInstancesService.formInstancesControllerCreate(
        newFormInstance,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api', 'form-instances'] });
    },
  });

  // Fetch form templates data
  const { data: formTemplates, error: formTemplatesError } = useQuery({
    queryKey: ['api', 'form-templates'],
    queryFn: () => FormTemplatesService.formTemplatesControllerFindAll(),
  });

  // Fetch positions data
  const { data: positions, error: positionsError } = useQuery({
    queryKey: ['api', 'positions'],
    queryFn: () => PositionsService.positionsControllerFindAll(),
  });

  useEffect(() => {
    setSignaturePositions(
      new Array(selectedFormTemplate?.signatureFields.length).fill(null),
    );
  }, [selectedFormTemplate]);

  /**
   * @sideEffects - Uploads the form instance to the database and storage
   * @returns None
   */
  const _submitFormInstance = async () => {
    if (!selectedFormTemplate) return;

    const uuid = uuidv4();
    const newFormLink =
      selectedFormTemplate.name.replaceAll(' ', '_') + '_instance_' + uuid;

    await createFormInstanceMutation
      .mutateAsync({
        name: formName, // Use the updated form name
        signatures: signaturePositions.map((pos, i) => {
          return {
            order: i,
            signerPositionId: pos?.value!,
            assignedUserId: pos?.employeeValue!,
          };
        }),
        originatorId: user?.id!,
        formTemplateId: selectedFormTemplate?.id!,
        formDocLink: newFormLink, // create new form link for each form instance
      })
      .then((response) => {
        _handleModalClose();
        return response;
      })
      .catch((e) => {
        throw e;
      });

    const blob = await storage.downloadBlob(selectedFormTemplate?.formDocLink!);

    const newFile = new File([blob!], newFormLink, {
      type: 'application/pdf',
    });

    await storage.uploadBlob(newFile, newFormLink);
  };

  useEffect(() => {
    if (selectedFormTemplate) {
      setFormName(selectedFormTemplate.name);
    }
  }, [selectedFormTemplate]);

  useEffect(() => {
    if (formBlob && formBlob.size > 0)
      setFormURL(URL.createObjectURL(formBlob!));
  }, [formBlob]);

  const _handleModalClose = () => {
    onClose();
    setFormName('Create Form');
    setSelectedFormTemplate(null);
    setFormTypeSelected(false);
    setSignaturePositions([]);
  };

  function EditableControls() {
    const { isEditing, getEditButtonProps } = useEditableControls();

    return isEditing ? null : (
      <Flex justifyContent="center">
        <Box {...getEditButtonProps()}>
          <Box
            as={GrayPencilIcon}
            color="gray.500"
            fontSize="20px"
            _hover={{
              color: 'black',
              textDecoration: 'underline',
            }}
            cursor="pointer"
            m="5px"
          />
        </Box>
      </Flex>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={_handleModalClose}>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent minWidth="936px" minHeight="761px" padding="20px">
        <ModalCloseButton />
        <ModalHeader>
          <Editable
            placeholder="Enter form name"
            onChange={(value) => {
              setFormName(value);
            }}
            onSubmit={(value) => {
              setFormName(value);
            }}
            onCancel={(value) => {
              setFormName(value);
            }}
            value={formName}
          >
            <HStack>
              <EditablePreview
                style={{
                  fontWeight: 800,
                  fontSize: '27px',
                }}
              />
              <EditableInput
                minW="20em"
                style={{
                  fontWeight: 800,
                  fontSize: '27px',
                }}
              />
              <EditableControls />
            </HStack>
          </Editable>
        </ModalHeader>
        <ModalBody>
          <Flex gap="30px">
            <Box flex="1">
              <Heading as="h3" mb="10px">
                Form Type
              </Heading>
              <Select
                useBasicStyles
                selectedOptionStyle="check"
                options={formTemplates}
                placeholder="Select Form Template"
                value={selectedFormTemplate}
                onChange={(option) => {
                  setSelectedFormTemplate(option);
                  setFormTypeSelected(option !== null);
                  if (option !== null) {
                    setFormName(option?.name);
                  }
                }}
                className="custom-dropdown"
                components={{
                  DropdownIndicator: (props: any) => (
                    <chakraComponents.DropdownIndicator {...props}>
                      {isFormTypeDropdownOpen ? (
                        <DropdownUpArrow maxH="7px" />
                      ) : (
                        <DropdownDownArrow maxH="7px" />
                      )}
                    </chakraComponents.DropdownIndicator>
                  ),
                }}
                onMenuOpen={() => setIsFormTypeDropdownOpen(true)}
                onMenuClose={() => setIsFormTypeDropdownOpen(false)}
                isOptionSelected={(option, _) => {
                  return option.id == selectedFormTemplate?.id;
                }}
                getOptionLabel={(option) => option.name}
                classNamePrefix="react-select"
                isClearable
                closeMenuOnSelect
              />
              {formURL ? (
                <embed
                  src={formURL}
                  type="application/pdf"
                  width="400px"
                  height="500px"
                  style={{
                    marginTop: '16px',
                    border: '3px solid black',
                    borderRadius: '8px',
                  }}
                />
              ) : (
                <Skeleton h="518px" background="gray" marginTop="12px" />
              )}
            </Box>
            {!formTypeSelected && (
              <Flex flex="1" justifyContent="center">
                <Box width="273px" height="42px">
                  <Text
                    fontWeight="500"
                    fontSize="16px"
                    color="#9D9D9D"
                    marginTop="40px"
                    textAlign="center"
                  >
                    Assignees will appear once form type has been selected.
                  </Text>
                </Box>
              </Flex>
            )}

            {formTypeSelected && (
              <Box flex="1">
                <Heading as="h3" mb="28px">
                  Assignees
                </Heading>
                {selectedFormTemplate?.signatureFields.map((field, i) => (
                  <SignatureDropdown
                    key={field.id}
                    field={field}
                    index={i}
                    positions={positions}
                    signaturePositions={signaturePositions}
                    setSignaturePositions={setSignaturePositions}
                  />
                ))}
              </Box>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor="#4C658A"
            textColor="white"
            width="161px"
            height="40px"
            onClick={_submitFormInstance}
          >
            Create Form
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateFormInstanceModal;
