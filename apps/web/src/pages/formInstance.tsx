import { Avatar, Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import {
  LeftArrowIcon,
  PencilIcon,
  CheckIcon,
  EditUnderlineIcon,
} from 'apps/web/src/static/icons';
import AvatarMap from '../components/AvatarMap';
import { useState } from 'react';

const FormInstance = () => {
  const names = [
    { name: 'Elvin Cheng', signed: true, title: 'Director' },
    { name: 'Anshul Shirude', signed: true, title: 'Leadership Team Member' },
    { name: 'Kai Zheng', signed: false, title: 'Department Head' },
    { name: 'Angela Weigl', signed: false, title: 'Project Manager' },
  ];

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box className="main">
      <Flex
        ml="50px"
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
          ml="30px"
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
          _hover={{ textDecoration: 'none' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Flex flexDirection="column">
            <Flex>
              <PencilIcon mr={1} mt={6} />
              <Text color="#000" style={{ fontSize: '18px', textDecoration: "none"}} mt={5}>
                Edit
              </Text>
            </Flex>
            {isHovered && (
              <EditUnderlineIcon
                stroke="black"
                width="52px"
                height="2"
                fill="none"
              />
            )}
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
        ml="50px"
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
        ml="50px"
        maxW="450px"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et
        imperdiet enim. Ut enim justo, tincidunt ac enim ut, mollis pulvinar
        neque. Suspendisse id semper nunc.
      </Text>

      <Grid templateColumns="1fr 1fr" gap="100px" mt={20}>
        <Box>
          <Text
            color="#000"
            fontFamily="Hanken Grotesk"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="normal"
            ml="50px"
          >
            Form Preview
          </Text>
          <Box
            ml="50px"
            mt={6}
            mb="100px"
            bg="#000"
            minWidth="436.353px"
            minHeight="566.219px"
          />
        </Box>

        <Box>
          <Text
            color="#000"
            fontFamily="Hanken Grotesk"
            fontSize="20px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="normal"
          >
            Assignees
          </Text>
          <AvatarMap names={names} />
        </Box>
      </Grid>
    </Box>
  );
};

export default FormInstance;
