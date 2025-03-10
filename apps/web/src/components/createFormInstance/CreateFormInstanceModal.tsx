import React, { useState, useEffect } from 'react';
import {
  Flex,
  Box,
  Heading,
  Text,
  Skeleton,
  Editable,
  HStack,
  Button,
} from '@chakra-ui/react';
import { DropdownDownArrow, DropdownUpArrow } from '@web/static/icons.tsx';
import { chakraComponents, Select } from 'chakra-react-select';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SignatureDropdown } from './SignatureDropdown.tsx';
import { AssignedGroupData, CreateFormInstanceModalProps } from './types.ts';
import { useAuth } from '@web/hooks/useAuth.ts';
import { queryClient } from '@web/pages/_app.tsx';
import { GrayPencilIcon } from '@web/static/icons.tsx';
import {
  formInstancesControllerCreateMutation,
  formTemplatesControllerFindAllOptions,
  formTemplatesControllerFindAllQueryKey,
  positionsControllerFindAllOptions,
} from '@web/client/@tanstack/react-query.gen.ts';
import { FormTemplateEntity, SignerType } from '@web/client/types.gen.ts';
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from '../ui/dialog.tsx';

/**
 * @param open - boolean to determine if the modal is open
 * @param onClose - function to close the modal
 * @returns a modal to create a form instance
 */
const CreateFormInstanceModal: React.FC<CreateFormInstanceModalProps> = ({
  open,
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

  return (
    <DialogRoot open={open} onOpenChange={_handleModalClose}>
      <DialogBackdrop backdropFilter="blur(2px)" />
      <DialogContent minWidth="936px" minHeight="761px" padding="20px">
        <DialogCloseTrigger />
        <DialogHeader>
          <Editable.Root
            placeholder="Enter form name"
            onValueChange={(value) => {
              setFormName(value.value);
            }}
            onValueCommit={(value) => {
              setFormName(value.value);
            }}
            onValueRevert={(value) => {
              setFormName(value.value);
            }}
            value={formName}
          >
            <HStack>
              <Editable.Preview
                style={{
                  fontWeight: 800,
                  fontSize: '27px',
                }}
              />
              <Editable.Input
                minW="20em"
                style={{
                  fontWeight: 800,
                  fontSize: '27px',
                }}
              />
              <Editable.Control>
                <Editable.EditTrigger asChild>
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
                </Editable.EditTrigger>
              </Editable.Control>
            </HStack>
          </Editable.Root>
        </DialogHeader>
        <DialogBody>
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
                onChange={(option: FormTemplateEntity) => {
                  setSelectedFormTemplate(option);
                  setFormTypeSelected(true);
                }}
                className="custom-dropdown"
                components={{
                  DropdownIndicator: (
                    props: React.ComponentProps<
                      typeof chakraComponents.DropdownIndicator
                    >,
                  ) => (
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
                isOptionSelected={(option: FormTemplateEntity, _: unknown) => {
                  return option.id == selectedFormTemplate?.id;
                }}
                getOptionLabel={(option: FormTemplateEntity) => option.name}
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
        </DialogBody>
        <DialogFooter>
          <Button
            backgroundColor="#4C658A"
            css={{ '--color': 'white' }}
            width="161px"
            height="40px"
            onClick={_submitFormInstance}
          >
            Create Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default CreateFormInstanceModal;
