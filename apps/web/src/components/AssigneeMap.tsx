import { Flex, Text } from '@chakra-ui/react';
import { AwaitingIcon } from 'apps/web/src/static/icons.tsx';
import { AvatarMapProps } from './types.ts';
import { SignerType } from '@web/client/types.gen.ts';
import { Avatar } from './ui/avatar.tsx';

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
    <Flex flexDirection="column" gap="24px" position="relative">
      {assignees.map((assignee, index) => {
        const awaiting = previousSigned && !assignee.signed;
        previousSigned = assignee.signed;
        return (
          <Flex key={index} flexDirection="column" alignSelf="stretch">
            <Flex columnGap="8px" alignItems="center">
              <Avatar
                name={getInitialsFromTitle(
                  assignee.title,
                  assignee.signerType,
                  assignee.signed,
                )}
                boxSize="32px"
                padding="6px 7px"
                size="md"
                color="#0C0C0C"
                bg={
                  assignee.signed ? '#D1F0D4' : awaiting ? '#FFF2D9' : '#E5E5E5'
                }
                border="1px solid #FFFFFF"
              />
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flex="1 0 0"
              >
                <Text color="#0C0C0C" fontSize="15px" lineHeight="20px">
                  {assignee.title}
                </Text>
                <Flex>
                  {assignee.signed ? (
                    <Flex align="center">
                      <Text
                        color="#008933"
                        whiteSpace="nowrap"
                        fontSize="13px"
                        fontWeight="500px"
                      >
                        Signed
                      </Text>
                    </Flex>
                  ) : (
                    awaiting && (
                      <Flex align="center" gap="4px">
                        <AwaitingIcon />
                        <Text
                          color="#9D6401"
                          whiteSpace="nowrap"
                          fontSize="13px"
                          fontWeight="500px"
                        >
                          Awaiting Your Signature
                        </Text>
                      </Flex>
                    )
                  )}
                </Flex>
              </Flex>
            </Flex>
            <Flex
              marginTop="-4px"
              justifyContent="space-between"
              alignItems="center"
              flex="1 0 0"
            >
              <Text
                color="#515151"
                fontSize="13px"
                fontWeight="400"
                lineHeight="normal"
                paddingLeft={'40px'}
              >
                {assignee.title}
              </Text>
              {assignee.signed ? (
                <Text
                  color="#515151"
                  fontSize="13px"
                  fontWeight="400"
                  lineHeight="normal"
                >
                  {new Date(assignee.updatedAt).toLocaleDateString()}
                </Text>
              ) : (
                <></>
              )}
            </Flex>
            {index < assignees.length - 1 ? (
              <Flex
                position="absolute"
                borderLeftWidth="1px"
                height="33px"
                marginTop="34px"
                marginLeft="15.5px"
                borderLeftColor="#A1A1A1"
              />
            ) : (
              <></>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default AssigneeMap;
