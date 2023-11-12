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

// TODO
// select assignee search icon  
// set default width of assignee dropdowns to be wider
// elipsis for overflow 
// make form name editable

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

  const createFormInstanceMutation = useMutation({
    mutationFn: async (newFormInstance: CreateFormInstanceDto) => {
      return FormInstancesService.formInstancesControllerCreate(
        newFormInstance,
      );
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

  const submitFormInstance = async () =>
    createFormInstanceMutation
      .mutateAsync({
        name: selectedFormTemplate?.name ?? 'New Form',
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              {selectedFormTemplate ? selectedFormTemplate.name : 'New Form'}
            </Text>
            <Flex flexDirection="row">
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
                  getOptionLabel={(option) => option.name}
                  classNamePrefix="react-select"
                  isClearable
                />
                <Box
                  width="496px"
                  height="436px"
                  backgroundColor="gray.300"
                  marginBottom="10px"
                  marginTop="10px"
                >
                  {/* Placeholder for PDF */}
                </Box>
              </Flex>

              {formTypeSelected ? (
                <Flex flexDirection="column">
                  <Text
                    fontFamily="Hanken Grotesk"
                    fontSize="17px"
                    fontWeight="700"
                    mb="10px"
                  >
                    Assignees
                  </Text>
                  <Box>
                    {selectedFormTemplate?.signatureFields.map((field, i) => {
                      return (
                        <SignatureDropdown
                          key={field.id}
                          field={field}
                          index={i}
                          positions={positions}
                          signaturePositions={signaturePositions}
                          setSignaturePositions={setSignaturePositions}
                        />
                      );
                    })}
                  </Box>
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
            </Flex>

            <Button
              backgroundColor="#4C658A"
              textColor="white"
              width="161px"
              height="40px"
              position="absolute"
              right="40px"
              bottom="32px"
            >
              Create Form
            </Button>
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
