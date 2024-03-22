import { Avatar, Box, Flex, Grid, Text } from '@chakra-ui/react';
import { AwaitingIcon, CheckIcon } from 'apps/web/src/static/icons';

type Assignee = {
  name?: string;
  signed: boolean;
  title: string;
  updatedAt: string;
};

type AvatarMapProps = {
  assignees: Assignee[];
};

const AssigneeMap: React.FC<AvatarMapProps> = ({ assignees }) => {
  let previousSigned = true;
  return (
    <Flex my={2} position="relative" flexDirection="column" mr={650}>
      {assignees.map((assignee, index) => (
        <Flex key={index} position="relative" my={4}>
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <Avatar
              name={assignee.name}
              src={undefined} // If you have an image source, provide it here
              size="md" // Adjust the size as needed
              color="black"
              bg={assignee.signed ? '#D1F0D4' : '#E5E5E5'}
            />
            <Box minWidth="240px">
              <Flex width="100%" flexDirection="column">
                <Text
                  color="#000"
                  fontFamily="Hanken Grotesk"
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight="500"
                  lineHeight="normal"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '240px',
                  }}
                >
                  {assignee.title}
                </Text>
                {assignee.name ? (
                  <Text
                    color="#5E5E5E"
                    fontFamily="Hanken Grotesk"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="normal"
                    style={{ whiteSpace: 'nowrap', marginTop: '2px' }}
                  >
                    {assignee.name}
                  </Text>
                ) : (
                  <Text
                    color="#5E5E5E"
                    fontSize="16px"
                    fontStyle="italic"
                    style={{ whiteSpace: 'nowrap', marginTop: '2px' }}
                  >
                    Pending Signature
                  </Text>
                )}
              </Flex>
            </Box>
            <Box minWidth="200px">
              {assignee.signed && (
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
          {index < assignees.length - 1 && (
            <Box
              position="absolute"
              top="100%"
              left="22px"
              w="2px"
              h="40px"
              bg="#000"
              color={assignee.signed ? '#D1F0D4' : '#E5E5E5'}
            />
          )}
        </Flex>
      ))}
    </Flex>
  );
};

export default AssigneeMap;
