import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Box,
  Text,
} from '@chakra-ui/react';
import { DropdownDownArrow, DropdownUpArrow } from '@web/static/icons';
import { chakraComponents, Select } from 'chakra-react-select';
import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  CreateSignatureDto,
  EmployeesService,
  FormTemplateEntity,
  FormTemplatesService,
  PositionEntity,
  PositionsService,
} from '@web/client';
import { SignatureDropdown } from './SignatureDropdown';

// TODO
// make outline not blue when dropdown is clicked
// search directory in assignees and icon?
// set default width of assignee dropdowns to be wider
// more margin w search
// endpoint to get all templates
// get all positions for assignees
// end point to create new form instance
// check api spec
// make form name editable
// make modal stay the same size?

interface CreateFormInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface Option {
  value: string;
  label: string;
}

interface EmployeeData {
  id: string;
  firstName: string;
  lastName: string;
}

const CreateFormInstanceModal: React.FC<CreateFormInstanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const [selectedFormTemplate, setSelectedFormTemplate] =
    useState<FormTemplateEntity | null>(null);
  const [formTypeSelected, setFormTypeSelected] = useState(false);
  const [signaturePositions, setSignaturePositions] = useState<
    (Option | null)[]
  >([]);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent minWidth="fit-content" height="fit-content">
        <ModalCloseButton />
        <ModalHeader>
          <Text
            fontWeight="1000"
            fontSize="27px"
            color="black"
            paddingBottom="41px"
          >
            {selectedFormTemplate ? selectedFormTemplate.name : 'New Form'}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Flex flexDirection="row">
            <Flex flexDirection="column" marginRight="79px">
              <Text
                fontWeight="700"
                fontSize="20px"
                color="black"
                paddingBottom="12px"
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
                <Text fontWeight="700" fontSize="20px" color="black">
                  Assignees
                </Text>
                {selectedFormTemplate?.signatureFields.map((field, i) => {
                  return (
                    <SignatureDropdown
                      field={field}
                      index={i}
                      positions={positions}
                      signaturePositions={signaturePositions}
                      setSignaturePositions={setSignaturePositions}
                    />
                  );
                })}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateFormInstanceModal;
