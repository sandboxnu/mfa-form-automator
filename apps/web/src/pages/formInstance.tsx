import { Avatar, Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import {
  LeftArrowIcon,
  PencilIcon,
  CheckIcon,
  EditUnderlineIcon,
} from 'apps/web/src/static/icons';
import AvatarMap from '../components/AvatarMap';

const FormInstance = () => {
  const names = [
    { name: 'Elvin Cheng', signed: true, title: 'Director' },
    { name: 'Anshul Shirude', signed: true, title: 'Leadership Team Member' },
    { name: 'Kai Zheng', signed: false, title: 'Department Head' },
    { name: 'Angela Weigl', signed: false, title: 'Project Manager' },
  ];

  return (
    <Box className="main">
      <Flex
        ml={12}
        as="span"
        align="center"
        onClick={() => {
          // handle the click action here
        }}
        cursor="pointer"
        color="#4C658A"
        mt={10}
      >
        <LeftArrowIcon boxSize={3} mr={2} />
        <Text>Back to Pending</Text>
      </Flex>
      <Flex align="center" pl={4} mt={4}>
        <Text
          color="#000"
          fontFamily="Hanken Grotesk"
          fontSize="27px"
          fontStyle="normal"
          fontWeight="800"
          lineHeight="normal"
          ml={9}
          mt={4}
          mr={5}
        >
          Travel Authorization Form
        </Text>
        <Button
          variant="link"
          onClick={() => {
            // handle edit action here
          }}
          color="black"
          fontWeight="normal"
          textAlign="left"
        >
          <Flex flexDirection="column">
            <Flex>
              <PencilIcon mr={1} mt={5} />
              <Text color="#000" style={{ fontSize: '18px' }} mt={4}>
                Edit
              </Text>
            </Flex>
            <EditUnderlineIcon
              stroke="black"
              width="52px"
              height="2"
              fill="none"
            />
          </Flex>
        </Button>
      </Flex>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="20px"
        fontStyle="normal"
        fontWeight="700"
        lineHeight="normal"
        textAlign="left"
        my={4}
        pl={4}
        ml={9}
        mt={12}
      >
        Description
      </Text>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="16px"
        fontStyle="normal"
        fontWeight="normal"
        lineHeight="normal"
        textAlign="left"
        pl={4}
        ml={9}
        maxW="450px"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et
        imperdiet enim. Ut enim justo, tincidunt ac enim ut, mollis pulvinar
        neque. Suspendisse id semper nunc.
      </Text>
      <Flex justifyContent="space-between" mt={20}>
        <Box display="inline-block" minWidth="590px">
          <Text
            color="#000"
            fontFamily="Hanken Grotesk"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="normal"
            ml={9}
            pl={4}
          >
            Form Preview
          </Text>
        </Box>

        <Text
          mr="100%"
          color="#000"
          fontFamily="Hanken Grotesk"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="700"
          lineHeight="normal"
        >
          Assignees
        </Text>
      </Flex>

      <Flex justifyContent="space-between">
        <Box
          ml={12}
          pl={4}
          mt={6}
          mb="100px"
          bg="#000"
          minWidth="436.353px"
          minHeight="566.219px"
          marginRight="100px"
        />
        <AvatarMap names={names} />
      </Flex>
    </Box>
  );
};

export default FormInstance;
