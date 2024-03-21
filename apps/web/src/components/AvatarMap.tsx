import { Avatar, Box, Flex, Grid, Text } from '@chakra-ui/react';
import { AwaitingIcon, CheckIcon } from 'apps/web/src/static/icons';

type Assignee = {
  name?: string;
  signed: boolean;
  title: string;
};

type AvatarMapProps = {
  assignees: Assignee[];
};

const AssigneeMap: React.FC<AvatarMapProps> = ({ assignees }) => {
  let previousSigned = true;
  return (
    <Flex my={2} position="relative" flexDirection="column" mr={650}>
      {assignees.map((assignee, index) => {
        let awaiting = previousSigned && !assignee.signed;
        previousSigned = assignee.signed;
        return (
          <Flex key={index} position="relative" my={4}>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <Avatar
                name={assignee.name}
                size="sm"
                color="black"
                bg={
                  assignee.signed ? '#D1F0D4' : awaiting ? '#AA6B01' : '#E5E5E5'
                }
              />
              <Box minWidth="240px">
                <Flex width="100%" flexDirection="column">
                  <Text
                    color="#000"
                    fontFamily="Hanken Grotesk"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="500"
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '240px',
                    }}
                  >
                    {assignee.name ? assignee.name : 'Pending Signature'}
                  </Text>
                  <Text color="#5E5E5E">{assignee.title}</Text>
                  {/*  */}
                </Flex>
              </Box>
              <Box minWidth="200px">
                <Flex width="100%">
                  {assignee.signed ? (
                    <>
                      <CheckIcon textAlign="right" mr={1} mt={1} />
                      <Text
                        style={{ whiteSpace: 'nowrap' }}
                        mr={2}
                        color="#008933"
                      >
                        Signed
                      </Text>
                    </>
                  ) : (
                    awaiting && (
                      <>
                        <AwaitingIcon textAlign="right" mr={1} mt={1} />
                        <Text
                          style={{ whiteSpace: 'nowrap' }}
                          color="#AA6B01"
                          mr={2}
                        >
                          Awaiting
                        </Text>
                      </>
                    )
                  )}
                </Flex>
              </Box>
            </Grid>
            {index < assignees.length - 1 && (
              <Box
                position="absolute"
                top="32px"
                left="15px"
                w="1px"
                h="50px"
                bg="#000"
                color={assignee.signed ? '#D1F0D4' : '#E5E5E5'}
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default AssigneeMap;
