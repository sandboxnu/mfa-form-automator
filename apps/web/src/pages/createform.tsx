import { Box, Button, Flex, Text, Icon } from '@chakra-ui/react';
import { LeftArrowIcon } from '@web/static/icons';
import { useState } from 'react';
import Link from 'next/link';
import { DropdownDownArrow, DropdownUpArrow } from 'apps/web/src/static/icons';
import { Select, chakraComponents } from 'chakra-react-select';
// TODO 
// add clear icon to remove selected form type
// make outline not blue when dropdown is clicked
// search directory in assignees
// add search icon to all of them?
// or make it so when you click the dropdown again it unselects the currently selected stuff, will allow 
// search in directory right in dropdown
const CreateForm = () => {
  interface Option {
    value: string;
    label: string;
  }

  const [selectedForm, setSelectedForm] = useState<Option | null>(null);
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const [isLeadershipDropdownOpen, setIsLeadershipDropdownOpen] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);

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
      <span style={{ marginLeft: '8px' }}>{label}
      </span>
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
    <Flex flexDirection="column" marginLeft="49px">
      <Flex alignItems="center" marginTop="42px" marginBottom="22px">
        <Link href="/">
          <Flex alignItems="center">
            <LeftArrowIcon width="10px" height="10px" marginLeft="4px" marginRight="4px" />
            <Text fontWeight="500" fontSize="16px" color="#4C658A">
              Back to Overview
            </Text>
          </Flex>
        </Link>
      </Flex>
      <Text fontWeight="1000" fontSize="27px" color="black" paddingBottom="41px">
      {selectedForm ? selectedForm.label : "[New] Form"}
      </Text>

      <Flex flexDirection="row">
        <Flex flexDirection="column" marginRight="79px">
          <Text fontWeight="700" fontSize="20px" color="black">
            Form Type
          </Text>
          {/* TODO add clear button to reset */}
          <Select
          useBasicStyles
          selectedOptionStyle="check"
            options={formOptions}
            placeholder="Select Form Template"
            value={selectedForm}
            onChange={setSelectedForm}
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
            placeholder="Select assigneee"
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
            placeholder="Select assigneee"
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
      </Flex>

      <Link href="/">
        <Button
          backgroundColor="white"
          borderColor="#4C658A"
          border="1px"
          textColor="#4C658A"
          width="114px"
          height="40px"
          position="absolute"
          right="212px"
          bottom="32px"
        >
          Cancel
        </Button>
      </Link>
      <Button
        backgroundColor="#4C658A"
        textColor="white"
        width="161px"
        height="40px"
        position="absolute"
        right="40px"
        bottom="32px"
      >
        Submit Form
      </Button>
    </Flex>
  );
};

export default CreateForm;