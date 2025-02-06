import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { AwaitingIcon, CheckIcon } from 'apps/web/src/static/icons';
import { AvatarMapProps } from './types';
import { SignatureEntitySchema } from '@web/client/schemas.gen';
import { SignerType } from '@web/client';

/**
 * @param assignees - an array of assignees
 * @returns a map of assignees with their avatars
 */
const AssigneeMap: React.FC<AvatarMapProps> = ({ assignees }) => {
  let previousSigned = true;

  const getInitialsFromTitle = (
    title: string,
    signerType: SignerType,
    isSigned: boolean,
  ) => {
    SignatureEntitySchema;
    if (isSigned || signerType === SignerType.USER) {
      return title;
    } else if (signerType === SignerType.DEPARTMENT) {
      return 'D';
    } else if (signerType === SignerType.POSITION) {
      return 'P';
    } else if (signerType === SignerType.USER_LIST) {
      return 'U';
    }
  };

  return (
    <Flex marginTop="4px" flexDirection="column">
      {assignees.map((assignee, index) => {
        const awaiting = previousSigned && !assignee.signed;
        previousSigned = assignee.signed;

        return (
          <Flex key={index} align="center" my={4} position="relative">
            <Flex align="center" flex="1" zIndex={1}>
              <Avatar
                name={getInitialsFromTitle(
                  assignee.title,
                  assignee.signerType,
                  assignee.signed,
                )}
                size="sm"
                color="black"
                bg={
                  assignee.signed ? '#D1F0D4' : awaiting ? '#FFF2D9' : '#E5E5E5'
                }
                mr={4}
              />
              <Flex flexDirection="column">
                <Text
                  color="#5E5E5E"
                  fontFamily="Hanken Grotesk"
                  fontSize="16px"
                  fontWeight="400"
                >
                  {assignee.title}
                </Text>

                <Text
                  color="#5E5E5E"
                  fontFamily="Hanken Grotesk"
                  fontSize="16px"
                  fontWeight="400"
                  whiteSpace="nowrap"
                >
                  {assignee.signerType}
                </Text>
              </Flex>
            </Flex>

            <Flex>
              {assignee.signed ? (
                <Flex align="center">
                  <CheckIcon mr={1} mt={1} />
                  <Text color="#008933" whiteSpace="nowrap">
                    Signed
                  </Text>
                  <Text color="#515151" ml={2}>
                    {new Date(assignee.updatedAt).toLocaleDateString()}
                  </Text>
                </Flex>
              ) : (
                awaiting && (
                  <Flex align="center">
                    <AwaitingIcon mr={1} />
                    <Text color="#AA6B01" whiteSpace="nowrap">
                      Awaiting
                    </Text>
                  </Flex>
                )
              )}
            </Flex>

            {index < assignees.length - 1 && (
              <Box
                position="absolute"
                top="32px"
                left="15px"
                w="1px"
                h={`${(assignees.length - 1) * 60}px`}
                bg="#000"
                zIndex={0}
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
