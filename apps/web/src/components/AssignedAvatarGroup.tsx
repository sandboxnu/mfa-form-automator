import { Avatar, AvatarGroup, Box, Portal, Tooltip } from '@chakra-ui/react';
import { AssignedGroupEntityHydrated } from '@web/client/types.gen';
import { getNameFromAssignedGroup } from '@web/utils/formInstanceUtils';
import { HoverableAvatar } from './HoverableAvatar';

export const AssignedAvatarGroup = ({
  assignedGroups,
  detailed,
}: {
  assignedGroups: AssignedGroupEntityHydrated[];
  detailed?: boolean;
}) => {
  const partition = (arr: AssignedGroupEntityHydrated[], max: number) => {
    const items = [];
    const overflow = [];
    for (const item of arr.sort((a, b) => a.order - b.order)) {
      if (items.length < max) items.push(item);
      else overflow.push(item);
    }
    return { items, overflow };
  };

  const { items: displayedAssignedGroups } = partition(assignedGroups, 5);

  return (
    <AvatarGroup gap="0" spaceX="-2">
      {detailed
        ? displayedAssignedGroups.map((assignedGroup) => (
            <HoverableAvatar
              key={assignedGroup.id}
              name={getNameFromAssignedGroup(assignedGroup)}
              signed={assignedGroup.signed}
            />
          ))
        : displayedAssignedGroups.map((assignedGroup, i) => (
            <Tooltip.Root key={i}>
              <Tooltip.Trigger asChild>
                <Box>
                  <Avatar.Root
                    key={i}
                    boxSize="32px"
                    backgroundColor={
                      assignedGroup.signed ? '#D1F0D4' : '#DCDCDC'
                    }
                    outline="1px solid #FFFFFF"
                    color="black"
                    fontWeight={400}
                    fontSize="16px"
                    size="sm"
                  >
                    <Avatar.Fallback
                      name={
                        assignedGroup.signerEmployee?.firstName +
                        ' ' +
                        assignedGroup.signerEmployee?.lastName
                      }
                    />
                  </Avatar.Root>
                </Box>
              </Tooltip.Trigger>
              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content
                    fontSize="16px"
                    fontWeight="bold"
                    p="5px"
                    color="black"
                    background="white"
                  >
                    {assignedGroup.signerEmployee?.firstName +
                      ' ' +
                      assignedGroup.signerEmployee?.lastName}
                  </Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          ))}
    </AvatarGroup>
  );
};
