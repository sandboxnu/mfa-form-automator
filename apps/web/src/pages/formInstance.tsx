import { Avatar, Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
import {
  LeftArrowIcon,
  PencilIcon,
  CheckIcon,
} from 'apps/web/src/static/icons';

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
          <Flex alignItems="center" textDecoration="underline">
            <PencilIcon boxSize={4} mr={2} />
            Edit
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
        <Text
          color="#000"
          fontFamily="Hanken Grotesk"
          fontSize="20px"
          fontStyle="normal"
          fontWeight="700"
          lineHeight="normal"
          mr={800}
        >
          Assignees
        </Text>
      </Flex>

      <Flex justifyContent="space-between">
        <Box
          ml={12}
          pl={4}
          mt={6}
          bg="#000"
          width="436.353px"
          height="566.219px"
        />
        <Flex my={2} position="relative" flexDirection="column" mr={510}>
          {names.map((person, index) => (
            <Flex key={index} position="relative" my={4}>
              <Grid templateColumns="auto 1fr" gap={4}>
                <Avatar
                  name={person.name}
                  src={undefined} // If you have an image source, provide it here
                  size="md" // Adjust the size as needed
                  color="black"
                  bg={person.signed ? '#D1F0D4' : '#E5E5E5'}
                />
                <Box minWidth="100px">
                  <Flex width="100%">
                    <Text
                      color="#000"
                      fontFamily="Hanken Grotesk"
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight="500"
                      lineHeight="normal"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {person.title}
                    </Text>
                    {person.signed && (
                      <Flex width="100%" ml={2}>
                        <Text style={{ whiteSpace: "nowrap" }} mr={2} color="#008933">Already Signed</Text>
                        <CheckIcon textAlign="right" mt={1}> </CheckIcon>
                      </Flex>
                    )}
                  </Flex>
                  <Text
                    color="#5E5E5E"
                    font-family="Hanken Grotesk"
                    font-size="16px"
                    font-style="normal"
                    font-weight="400"
                    line-height="normal"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {person.name}
                  </Text>
                </Box>
              </Grid>
              {index < names.length - 1 && (
                <Box
                  position="absolute"
                  top="100%"
                  left="22px"
                  w="2px"
                  h="40px"
                  bg="#000"
                  color={person.signed ? '#D1F0D4' : '#E5E5E5'}
                />
              )}
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default FormInstance;
