import React, { useState } from 'react';
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
  Text
} from '@chakra-ui/react';
import { DropdownDownArrow, DropdownUpArrow } from '@web/static/icons';
import { chakraComponents, Select } from 'chakra-react-select';
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

const CreateFormInstanceModal: React.FC<CreateFormInstanceModalProps> = ({ isOpen, onClose }) => {
  interface Option {
    value: string;
    label: string;
  }

  const [selectedForm, setSelectedForm] = useState<Option | null>(null);
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const [isLeadershipDropdownOpen, setIsLeadershipDropdownOpen] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);
  const [formTypeSelected, setFormTypeSelected] = useState(false);


  const formOptions: Option[] = [
    { value: 'Form 1', label: 'Form 1' },
    { value: 'Form 2', label: 'Form 2' },
    { value: 'Form 3', label: 'Form 3' },
  ];

  const assigneeOptions: Option[] = [
    {
      value: 'Person 1',
      label: 'Role',
    },
    {
      value: 'Person 2',
      label: 'Role',
    },
    {
      value: 'Person 3',
      label: 'Role',
    },
  ];

  type OptionLabel = {
    value: string;
    label: string;
  };

  const formatOptionLabel = ({ value, label }: OptionLabel) => (
    <span>
      <strong>{value}</strong>
      <span style={{ marginLeft: '8px', color: 'gray' }}>{label}</span>
    </span>
  );

  const components = {
    DropdownIndicator: (props: any) => (
      <chakraComponents.DropdownIndicator {...props}>
        <div style={{ marginLeft: '10px' }}>
          <DropdownDownArrow />
        </div>
      </chakraComponents.DropdownIndicator>
    ),
  };

  const handleFormTypeDropdownOpen = () => {
    setIsFormTypeDropdownOpen(true);
    setIsLeadershipDropdownOpen(false);
    setIsDepartmentDropdownOpen(false);
  };

  const handleLeadershipDropdownOpen = () => {
    setIsLeadershipDropdownOpen(true);
    setIsFormTypeDropdownOpen(false);
    setIsDepartmentDropdownOpen(false);
  };

  const handleDepartmentDropdownOpen = () => {
    setIsDepartmentDropdownOpen(true);
    setIsFormTypeDropdownOpen(false);
    setIsLeadershipDropdownOpen(false);
  };

  const handleDropdownClose = () => {
    setIsFormTypeDropdownOpen(false);
    setIsLeadershipDropdownOpen(false);
    setIsDepartmentDropdownOpen(false);
  };

  const FormTypeDropdownIndicator = (props: any) => (
    <chakraComponents.DropdownIndicator {...props}>
      {isFormTypeDropdownOpen ? <DropdownUpArrow /> : <DropdownDownArrow />}
    </chakraComponents.DropdownIndicator>
  );

  const LeadershipDropdownIndicator = (props: any) => (
    <chakraComponents.DropdownIndicator {...props}>
      {isLeadershipDropdownOpen ? <DropdownUpArrow /> : <DropdownDownArrow />}
    </chakraComponents.DropdownIndicator>
  );

  const DepartmentDropdownIndicator = (props: any) => (
    <chakraComponents.DropdownIndicator {...props}>
      {isDepartmentDropdownOpen ? <DropdownUpArrow /> : <DropdownDownArrow />}
    </chakraComponents.DropdownIndicator>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay backdropFilter='blur(2px)' />
      <ModalContent minWidth="fit-content" height="fit-content">
        <ModalCloseButton />
        <ModalHeader>
          <Text fontWeight="1000" fontSize="27px" color="black" paddingBottom="41px">
            {selectedForm ? selectedForm.label : 'New Form'}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Flex flexDirection="row">
            <Flex flexDirection="column" marginRight="79px">
              <Text fontWeight="700" fontSize="20px" color="black" paddingBottom="12px">
                Form Type
              </Text>
              <Select
                useBasicStyles
                selectedOptionStyle="check"
                options={formOptions}
                placeholder="Select form template"
                value={selectedForm}
                onChange={(option) => {
                  setSelectedForm(option);
                  setFormTypeSelected(option !== null);
                }}
                className="custom-dropdown"
                components={{ DropdownIndicator: FormTypeDropdownIndicator }}
                onMenuOpen={handleFormTypeDropdownOpen}
                onMenuClose={handleDropdownClose}
                getOptionLabel={(option) => option.label}
                classNamePrefix="react-select"
                isClearable
              />
              <Box width="496px" height="436px" backgroundColor="gray.300" marginBottom="10px" marginTop="10px">
                {/* Placeholder for PDF */}
              </Box>
            </Flex>

            {formTypeSelected ? (
              <Flex flexDirection="column">
                <Text fontWeight="700" fontSize="20px" color="black">
                  Assignees
                </Text>
                <Text fontWeight="500" fontSize="16px" color="black" marginTop="40px">
                  Leadership Team Member
                </Text>
                <Select
                  useBasicStyles
                  selectedOptionStyle="check"
                  options={assigneeOptions}
                  placeholder="Select assignee"
                  className="custom-dropdown"
                  components={{ DropdownIndicator: LeadershipDropdownIndicator }}
                  onMenuOpen={handleLeadershipDropdownOpen}
                  onMenuClose={handleDropdownClose}
                  getOptionLabel={(option) => option.label}
                  formatOptionLabel={formatOptionLabel}
                  classNamePrefix="react-select"
                  isClearable
                />
                <Text fontWeight="500" fontSize="16px" color="black" marginTop="24px">
                  Department Head
                </Text>
                <Select
                  useBasicStyles
                  selectedOptionStyle="check"
                  options={assigneeOptions}
                  placeholder="Select assignee"
                  className="custom-dropdown"
                  components={{ DropdownIndicator: DepartmentDropdownIndicator }}
                  onMenuOpen={handleDepartmentDropdownOpen}
                  onMenuClose={handleDropdownClose}
                  getOptionLabel={(option) => option.label}
                  formatOptionLabel={formatOptionLabel}
                  classNamePrefix="react-select"
                  isClearable
                />
              </Flex>
            ) : (
              <Box width="273px" height="42px">
                <Text fontWeight="500" fontSize="16px" color="#9D9D9D" marginTop="40px" textAlign="center">
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
