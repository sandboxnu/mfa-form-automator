import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Box,
  Text,
  ModalFooter,
  Skeleton,
  Grid,
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  HStack,
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
      queryClient.invalidateQueries({ queryKey: ['api/form-instances/me'] });
      queryClient.invalidateQueries({
        queryKey: ['api/form-instances/created/me'],
      });
    },
  });

  // Fetch form templates data
  const { data: formTemplates, error: formTemplatesError } = useQuery({
    queryKey: ['api/form-templates'],
    queryFn: () => FormTemplatesService.formTemplatesControllerFindAll(),
  });

  // Fetch positions data
  const { data: positions, error: positionsError } = useQuery({
    queryKey: ['api/positions'],
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
        onClose();
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent minWidth="fit-content" height="fit-content">
        <ModalCloseButton />
        <ModalBody>
          <Box h="75vh" w="75vw">
            <Flex alignItems="center" pt="30px" pb="5px">
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
                      outline: 'none',
                      background: 'transparent',
                      padding: '0',
                      margin: '0',
                    }}
                  />
                  <EditableInput
                    minW="20em"
                    style={{
                      fontFamily: 'Hanken Grotesk',
                      fontWeight: 800,
                      fontSize: '27px',
                      outline: 'none',
                      background: 'transparent',
                      padding: '0',
                      margin: '0',
                    }}
                  />
                  <EditableControls />
                </HStack>
              </Editable>
            </Flex>
            <Grid templateColumns="repeat(2, 1fr)" gap={25} pt="30px">
              <Flex flexDirection="column" marginRight="79px">
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
                          <DropdownUpArrow />
                        ) : (
                          <DropdownDownArrow />
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
                  marginBottom="10px"
                  marginTop="10px"
                  w="100%"
                  h="450px"
                  background="gray"
                />
              </Flex>
              {formTypeSelected ? (
                <Flex flexDirection="column" w="100%">
                  <Text
                    fontFamily="Hanken Grotesk"
                    fontSize="17px"
                    fontWeight="700"
                    mb="10px"
                  >
                    Assignees
                  </Text>
                  <div
                    className="scrollable-div"
                    style={{
                      minHeight: '48.75vh',
                      maxHeight: '48.75vh',
                      overflowY: 'auto',
                      paddingRight: '5px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#4C658A transparent',
                      paddingLeft: '5px',
                    }}
                  >
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
                  </div>
                </Flex>
              ) : (
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
              )}
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
            bottom="32px"
            onClick={submitFormInstance}
          >
            Create Form
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateFormInstanceModal;
