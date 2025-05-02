import { Flex, Text } from '@chakra-ui/react';
import { AwaitingIcon } from 'apps/web/src/static/icons.tsx';
import { Assignee, AvatarMapProps } from './types.ts';
import { SignerType } from '@web/client/types.gen.ts';
import { Avatar } from './ui/avatar.tsx';

/**
 * @param assignees - an array of assignees
 * @returns a map of assignees with their avatars
 */
const AssigneeMap: React.FC<AvatarMapProps> = ({
  assignees,
}: {
  assignees: Assignee[];
}) => {
  const getInitialsFromTitle = (
    title: string,
    signerType: SignerType,
    signedAt: string | null,
  ) => {
    if (signedAt || signerType === SignerType.USER) {
      return title;
    } else if (signerType === SignerType.DEPARTMENT) {
      return 'D';
    } else if (signerType === SignerType.POSITION) {
      return 'P';
    } else if (signerType === SignerType.USER_LIST) {
      return 'U';
    }
  };

  // Find the index of the first unsigned assignee
  const firstUnsignedIndex = assignees.findIndex(
    (assignee) => !assignee.signedAt,
  );

  return (
    <Flex flexDirection="column" gap="24px" position="relative">
      {assignees.map((assignee, index) => {
        // Only the first unsigned assignee is marked as awaiting
        const awaiting = index === firstUnsignedIndex;
        // Determine if inactive styling should be applied
        const isInactive = assignee.isActive === false;

        return (
          <Flex key={index} flexDirection="column" alignSelf="stretch">
            <Flex columnGap="8px" alignItems="center">
              <Avatar
                name={getInitialsFromTitle(
                  assignee.title,
                  assignee.signerType,
                  assignee.signedAt,
                )}
                boxSize="32px"
                padding="6px 7px"
                size="md"
                color={isInactive ? '#828282' : '#0C0C0C'}
                bg={
                  assignee.signedAt
                    ? '#D1F0D4'
                    : awaiting
                    ? '#FFF2D9'
                    : '#E5E5E5'
                }
                border="1px solid #FFFFFF"
                opacity={isInactive ? 0.7 : 1}
              />
              <Flex
                justifyContent="space-between"
                alignItems="center"
                flex="1 0 0"
              >
                <Text
                  color={isInactive ? '#828282' : '#0C0C0C'}
                  fontSize="15px"
                  lineHeight="20px"
                  textDecoration={isInactive ? 'line-through' : 'none'}
                  opacity={isInactive ? 0.7 : 1}
                >
                  {assignee.title}
                  {isInactive && ' (Inactive)'}
                </Text>
                <Flex>
                  {assignee.signedAt ? (
                    <Flex align="center">
                      <Text
                        color="#008933"
                        whiteSpace="nowrap"
                        fontSize="13px"
                        fontWeight="500px"
                        opacity={isInactive ? 0.7 : 1}
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
                          opacity={isInactive ? 0.7 : 1}
                        >
                          Awaiting Signature
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
                opacity={isInactive ? 0.7 : 1}
              >
                {assignee.title}
              </Text>
              {assignee.signedAt ? (
                <Text
                  color="#515151"
                  fontSize="13px"
                  fontWeight="400"
                  lineHeight="normal"
                  opacity={isInactive ? 0.7 : 1}
                >
                  {new Date(assignee.signedAt).toLocaleDateString()}
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
                opacity={isInactive ? 0.5 : 1}
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
