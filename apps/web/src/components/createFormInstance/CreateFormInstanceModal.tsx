import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  Text,
  ModalFooter,
  Skeleton,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  HStack,
  ModalHeader,
  Button
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

// TODO
// fix form type dropdown bug

const CreateFormInstanceModal: React.FC<CreateFormInstanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const [selectedFormTemplate, setSelectedFormTemplate] =
    useState<FormTemplateEntity | null>(null);
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

  const submitFormInstance = async () => {
    createFormInstanceMutation
      .mutateAsync({
        name: formName, // Use the updated form name
        signatures: signaturePositions.map((pos, i) => {
          return {
            order: i,
            signerPositionId: pos?.value!,
          };
        }),
        originatorId: user?.id!,
        formTemplateId: selectedFormTemplate?.id!,
      })
      .then((response) => {
        handleModalClose();
        return response;
      })
      .catch((e) => {
        throw e;
      });
  };
  useEffect(() => {
    if (selectedFormTemplate) {
      setFormName(selectedFormTemplate.name);
    }
  }, [selectedFormTemplate]);

  const handleModalClose = () => {
    onClose();
    setFormName('Create Form');
    setSelectedFormTemplate(null);
    setFormTypeSelected(false);
    setSignaturePositions([]);
  }

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
    // scrollBehavior="inside" and maxHeight is used to make the modal scrollable
    <Modal isOpen={isOpen} onClose={handleModalClose}>
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
                  fontFamily: 'Hanken Grotesk',
                  fontWeight: 800,
                  fontSize: '27px',
                }}
              />
              <EditableInput
                minW="20em"
                style={{
                  fontFamily: 'Hanken Grotesk',
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
              <Text
                fontFamily="Hanken Grotesk"
                fontSize="17px"
                fontWeight="700"
                mb="10px"
              >
                Form Type
              </Text>
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
              <Skeleton
                h="518px"
                background="gray"
                marginTop="12px"
              />
            </Box>
            {!formTypeSelected && <Flex flex="1" justifyContent="center">
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
            </Flex>}

            {formTypeSelected && <Box flex="1">
              <Text
                fontFamily="Hanken Grotesk"
                fontSize="16px"
                fontWeight="700"
                mb="28px"
              >
                Assignees
              </Text>
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
            </Box>}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            backgroundColor="#4C658A"
            textColor="white"
            width="161px"
            height="40px"
            onClick={submitFormInstance}
          >
            Create Form
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal >
  );
};

export default CreateFormInstanceModal;
