import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { LeftArrowIcon } from '@web/static/icons';
import { useState } from 'react';
import Link from 'next/link';
import { DropdownDownArrow, DropdownUpArrow } from 'apps/web/src/static/icons';
// TODO make leadership/dept head selects searchable using chakra-react-select
import { GroupBase, OptionsOrGroups, Select } from 'chakra-react-select';

const CreateForm = () => {
  interface Option {
    value: string;
    label: string;
  }
  const [selectedForm, setSelectedForm] = useState<Option | null>(null);
  // const [selectedForm, setSelectedForm] = useState('');
  const options: Option[] = [
    // { value: '', label: 'Select Form Template' },
    { value: 'Form 1', label: 'Form 1' },
    { value: 'Form 2', label: 'Form 2' },
    { value: 'Form 3', label: 'Form 3' },
  ];



  // const handleFormChange = (selectedOption: Option) => {
  //   setSelectedForm(selectedOption.value);
  // };
  const handleFormChange = (selectedOption: Option) => {
    setSelectedForm(selectedOption);
  };



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
          <Select
          selectedOptionStyle="check"
            options={options}
            placeholder="Select Form Template"
            value={selectedForm}
            onChange={setSelectedForm}
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
          {/* <Select width="440px" height="40px" marginTop="9px"
            backgroundColor="white" icon={<DropdownDownArrow />}>
            <option selected hidden disabled value="">Select assignee</option>
            <option value="Form 1">First Last</option>
            <option value="Form 2">First Last</option>
            <option value="Form 3">First Last</option>
          </Select> */}
          <Text fontWeight="500" fontSize="16px" color="black" marginTop="24px">
            Department Head
          </Text>
          {/* <Select width="440px" height="40px" marginTop="9px"
            backgroundColor="white" icon={<DropdownDownArrow />}>
            <option selected hidden disabled value="">Select assignee</option>
            <option value="Form 1">First Last</option>
            <option value="Form 2">First Last</option>
            <option value="Form 3">First Last</option> 
        </Select> */}
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