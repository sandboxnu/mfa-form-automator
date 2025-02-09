import {
  Text,
  Avatar,
  Group,
  MenuContent,
  MenuItem,
  MenuRoot,
} from '@chakra-ui/react';
import { Tooltip } from './ui/tooltip';
import { AssignedGroupEntity } from '@web/client/types.gen';
import { MenuTrigger } from './ui/menu';

export const AssignedAvatarGroup = ({
  assignedGroups,
}: {
  assignedGroups: AssignedGroupEntity[];
}) => {
  const partition = (arr: AssignedGroupEntity[], max: number) => {
    const items = [];
    const overflow = [];
    for (const item of arr.sort((a, b) => a.order - b.order)) {
      if (items.length < max) items.push(item);
      else overflow.push(item);
    }
    return { items, overflow };
  };

  const { items: displayedAssignedGroups, overflow: overflowAssignedGroups } =
    partition(assignedGroups, 5);

  return (
    <Group gap="0" spaceX="2">
      {displayedAssignedGroups.map((sig, i) => (
        <Tooltip
          contentProps={{
            css: { '--tooltip-bg': 'white', color: 'black' },
          }}
          positioning={{ placement: 'bottom-start' }}
          content={
            <Text fontSize="16px" fontWeight="bold">
              {sig.signerEmployee?.firstName +
                ' ' +
                sig.signerEmployee?.lastName}
            </Text>
          }
          key={i}
        >
          <Avatar.Root
            key={i}
            boxSize="32px"
            backgroundColor={sig.signed ? '#D1F0D4' : '#DCDCDC'}
            outline="1px solid #FFFFFF"
            color="black"
            fontWeight={400}
            fontSize="16px"
            size="sm"
          >
            <Avatar.Fallback
              name={
                sig.signerEmployee?.firstName +
                ' ' +
                sig.signerEmployee?.lastName
              }
            />
          </Avatar.Root>
        </Tooltip>
      ))}
      {overflowAssignedGroups.length > 0 && (
        <MenuRoot positioning={{ placement: 'bottom' }}>
          <MenuTrigger rounded="full" focusRing="outside">
            <Avatar.Root variant="outline">
              <Avatar.Fallback>
                +{overflowAssignedGroups.length}
              </Avatar.Fallback>
            </Avatar.Root>
          </MenuTrigger>
          <MenuContent>
            {overflowAssignedGroups.map((sig, i) => (
              <MenuItem
                value={
                  sig.signerEmployee?.firstName +
                  ' ' +
                  sig.signerEmployee?.lastName
                }
                key={i}
              >
                <Avatar.Root
                  boxSize="32px"
                  backgroundColor={sig.signed ? '#D1F0D4' : '#DCDCDC'}
                  outline="1px solid #FFFFFF"
                  color="black"
                  fontWeight={400}
                  fontSize="16px"
                  size="xs"
                >
                  <Avatar.Fallback
                    name={
                      sig.signerEmployee?.firstName +
                      ' ' +
                      sig.signerEmployee?.lastName
                    }
                  />
                </Avatar.Root>
                {sig.signerEmployee?.firstName +
                  ' ' +
                  sig.signerEmployee?.lastName}
              </MenuItem>
            ))}
          </MenuContent>
        </MenuRoot>
      )}
    </Group>
  );
};
