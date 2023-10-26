import { Box, Button, Flex, Select, Text } from '@chakra-ui/react';
import { LeftArrowIcon } from '@web/static/icons';
import { useState } from 'react';
import Link from 'next/link';
import { DropdownDownArrow, DropdownUpArrow } from 'apps/web/src/static/icons';
// TODO make leadership/dept head selects searchable using chakra-react-select
// import { Select } from 'chakra-react-select';

const CreateForm = () => {

  const [selectedForm, setSelectedForm] = useState('');
  const [isDropdownFocused, setIsDropdownFocused] = useState(false);
  const [isDropdownIconChanged, setIsDropdownIconChanged] = useState(false);

  const handleFormChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsDropdownIconChanged(false);
    setSelectedForm(event.target.value);
  };

  const handleDropdownFocus = () => {
    setIsDropdownFocused(true);
  };

  const handleDropdownBlur = () => {
    setIsDropdownFocused(false);
  };

  const handleDropdownClick = () => {
    setIsDropdownIconChanged(true);
  };

  const renderDropdownIcon = () => {
    if (isDropdownFocused) {
      return <DropdownUpArrow />;
    }
    else {
      return <DropdownDownArrow />;
    }
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
        {[selectedForm ? `[New] ${selectedForm}` : "[New] Form"]}
      </Text>

      <Flex flexDirection="row">
        <Flex flexDirection="column" marginRight="79px">
          <Text fontWeight="700" fontSize="20px" color="black">
            Form Type
          </Text>
          {/* TO DO fix icon so it changes back to down arrow immediately on clicking dropdown option */}
          <Select width="496px" height="40px" marginTop="12px" marginBottom="16px"
            onChange={handleFormChange} value={selectedForm} className={selectedForm ? '' : 'lighter-text'}
            backgroundColor="white"
            icon={renderDropdownIcon()}
            onFocus={handleDropdownFocus}
            onBlur={handleDropdownBlur}>
            <option value="">Select Form Template</option>
            <option value="Form 1" onClick={handleDropdownClick}>Form 1</option>
            <option value="Form 2" onClick={handleDropdownClick}>Form 2</option>
            <option value="Form 3" onClick={handleDropdownClick}>Form 3</option>
          </Select>
          <Box width="496px" height="436px" backgroundColor="gray.300" marginBottom="10px">
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
          <Select width="440px" height="40px" marginTop="9px"
            backgroundColor="white" icon={<DropdownDownArrow />}>
            <option selected hidden disabled value="">Select assignee</option>
            <option value="Form 1">First Last</option>
            <option value="Form 2">First Last</option>
            <option value="Form 3">First Last</option>
          </Select>
          <Text fontWeight="500" fontSize="16px" color="black" marginTop="24px">
            Department Head
          </Text>
          <Select width="440px" height="40px" marginTop="9px"
            backgroundColor="white" icon={<DropdownDownArrow />}>
            <option selected hidden disabled value="">Select assignee</option>
            <option value="Form 1">First Last</option>
            <option value="Form 2">First Last</option>
            <option value="Form 3">First Last</option>
          </Select>
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