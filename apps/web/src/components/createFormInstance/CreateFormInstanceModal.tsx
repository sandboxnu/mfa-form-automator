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
import { SignatureDropdown } from './SignatureDropdown';
import { AssignedGroupData, CreateFormInstanceModalProps } from './types';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { GrayPencilIcon } from '@web/static/icons';
import { FormTemplateEntity, SignerType } from '@web/client';
import {
  formInstancesControllerCreateMutation,
  formTemplatesControllerFindAllOptions,
  formTemplatesControllerFindAllQueryKey,
  positionsControllerFindAllOptions,
} from '@web/client/@tanstack/react-query.gen';

/**
 * @param isOpen - boolean to determine if the modal is open
 * @param onClose - function to close the modal
 * @returns a modal to create a form instance
 */
const CreateFormInstanceModal: React.FC<CreateFormInstanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const [selectedFormTemplate, setSelectedFormTemplate] =
    useState<FormTemplateEntity | null>(null);
  const [assignedGroupsData, setAssignedGroupsData] = useState<
    AssignedGroupData[]
  >([]);
  const [formTypeSelected, setFormTypeSelected] = useState(false);
  const [formName, setFormName] = useState('Create Form');
  const createFormInstanceMutation = useMutation({
    ...formInstancesControllerCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: formTemplatesControllerFindAllQueryKey(),
      });
    },
  });

  const { data: formTemplates } = useQuery({
    ...formTemplatesControllerFindAllOptions(),
  });

  const { data: positions } = useQuery({
    ...positionsControllerFindAllOptions(),
  });

  /**
   * Reset signature positions when form template changes
   */
  useEffect(() => {
    if (!selectedFormTemplate) return;

    setAssignedGroupsData(
      selectedFormTemplate.fieldGroups.map((_, i) => {
        return {
          fieldGroupId: selectedFormTemplate?.fieldGroups[i].id!,
          order: i,
        };
      }),
    );
  }, [selectedFormTemplate]);

  /**
   * Updates form instance with the selected form template, form name, and signature positions
   */
  const _submitFormInstance = async () => {
    if (!selectedFormTemplate) return;
    if (!assignedGroupsData) return;

    await createFormInstanceMutation
      .mutateAsync({
        body: {
          name: formName,
          assignedGroups: assignedGroupsData.map((pos, i) => {
            return {
              order: i,
              fieldGroupId: pos?.fieldGroupId,
              // signerEmployeeId: undefined,
              signerType: SignerType.POSITION,
              // signerDepartmentId: undefined,
              // TODO: when we support multiple types, we should create this list outside of the mutation
              signerPositionId: pos.positionId!,
              signerEmployeeList: [],
            };
          }),
          originatorId: user?.id!,
          formTemplateId: selectedFormTemplate?.id!,
          formDocLink: selectedFormTemplate?.formDocLink!,
          description: selectedFormTemplate?.description
            ? selectedFormTemplate?.description
            : undefined,
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
   * Sets the form name when a form template is selected
   */
  useEffect(() => {
    if (selectedFormTemplate) {
      setFormName(selectedFormTemplate.name);
    }
  }, [selectedFormTemplate]);

  /**
   * Closes the modal and resets the form name, selected form template, and signature positions
   */
  const _handleModalClose = () => {
    onClose();
    setFormName('Create Form');
    setSelectedFormTemplate(null);
    setFormTypeSelected(false);
    setAssignedGroupsData([]);
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
                  setFormTypeSelected(true);
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
              {selectedFormTemplate ? (
                <embed
                  src={selectedFormTemplate.formDocLink}
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
                {selectedFormTemplate?.fieldGroups.map((field, i) => (
                  <SignatureDropdown
                    key={field.id}
                    field={field}
                    index={i}
                    positions={positions}
                    assignedGroupData={assignedGroupsData}
                    setAssignedGroupData={setAssignedGroupsData}
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
