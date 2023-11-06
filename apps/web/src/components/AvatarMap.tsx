import { Avatar, Box, Flex, Grid, Text } from '@chakra-ui/react';
import { CheckIcon } from 'apps/web/src/static/icons';

type Person = {
  name: string;
  signed: boolean;
  title: string;
};

type AvatarMapProps = {
  names: Person[];
};

const AvatarMap: React.FC<AvatarMapProps> = ({ names }) => {
  return (
    <Flex my={2} position="relative" flexDirection="column" mr={650}>
      {names.map((person, index) => (
        <Flex key={index} position="relative" my={4}>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <Avatar
              name={person.name}
              src={undefined} // If you have an image source, provide it here
              size="md" // Adjust the size as needed
              color="black"
              bg={person.signed ? '#D1F0D4' : '#E5E5E5'}
            />
            <Box minWidth="200px">
              <Flex width="100%">
                <Text
                  color="#000"
                  fontFamily="Hanken Grotesk"
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight="500"
                  lineHeight="normal"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {person.title}
                </Text>
              </Flex>
              <Text
                color="#5E5E5E"
                fontFamily="Hanken Grotesk"
                fontSize="16px"
                fontStyle="normal"
                fontWeight="400"
                lineHeight="normal"
                style={{ whiteSpace: 'nowrap' }}
              >
                {person.name}
              </Text>
            </Box>
            <Box minWidth="200px">
              {person.signed && (
                <Flex width="100%" ml={2}>
                  <Text style={{ whiteSpace: 'nowrap' }} mr={2} color="#008933">
                    Already Signed
                  </Text>
                  <CheckIcon textAlign="right" mt={1}>
                    {' '}
                  </CheckIcon>
                </Flex>
              )}
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
  );
};

export default AvatarMap;
