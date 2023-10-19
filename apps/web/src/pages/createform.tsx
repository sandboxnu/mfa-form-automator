import {Flex, Link, Text, VStack} from '@chakra-ui/react';
import { LeftArrowIcon } from '@web/static/icons';

const CreateForm = () => {
  return (
    <Flex flexDirection="column" marginLeft="49px"> 
      <Link href='/'>
        <Flex alignItems="center" marginTop="42px" marginBottom="22px">
          <LeftArrowIcon width="10px" height="10px" marginLeft="4px" marginRight="4px" />
          <Text fontWeight="700" fontSize="16px" color="#4C658A">
            Back to Overview
          </Text>
        </Flex>
      </Link>
      <Text fontWeight="1000" fontSize="27px" color="black" paddingBottom="41px">
        [Draft] Form Name Placeholder
      </Text>
      <Text fontWeight="700" fontSize="20px" color="black" paddingBottom="10px">
        Form Type
      </Text>
    </Flex>
  );
};

export default CreateForm;