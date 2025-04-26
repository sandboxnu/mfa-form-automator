import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { BlueTriangle } from '@web/static/icons';
import AssigneeMap from './AssigneeMap';
import { FormInstanceEntity, SignerType } from '@web/client';
import { getNameFromAssignedGroup } from '@web/utils/formInstanceUtils';
import router from 'next/router';

export const SidePreviewForm = ({
  formInstance,
}: {
  formInstance: FormInstanceEntity;
}) => {
  return (
    <Box
      as="nav"
      pos="fixed"
      top="64px"
      left="0"
      zIndex="1000"
      h="full"
      pb="10"
      overflow="visible"
      boxShadow="1px 0px 4px #E5E5E5"
      bg="#FEFEFE"
      _dark={{
        bg: 'gray.800',
      }}
      borderRightWidth="1px"
      width="440px"
    >
      <Flex
        direction="column"
        px="32px"
        pt="24px"
        gap="48px"
        alignItems="flex-start"
      >
        <Link onClick={() => router.push('/')}>
          <Flex alignItems="center" gap="8px">
            <BlueTriangle width="7.5px" height="8.75px" />
            <Text color="#1367EA" fontSize="15px" fontWeight="500">
              Back To Dashboard
            </Text>
          </Flex>
        </Link>
        <Flex
          flexDirection="column"
          justifyContent={'space-between'}
          alignSelf="stretch"
          gap="12px"
        >
          <Text fontSize="16px" fontWeight="600">
            Assignees
          </Text>
          <AssigneeMap
            assignees={formInstance.assignedGroups.map((assignedGroup) => ({
              title: getNameFromAssignedGroup(assignedGroup),
              signerType: assignedGroup.signerType as SignerType,
              signedAt: assignedGroup.signed,
            }))}
          />
        </Flex>
      </Flex>
    </Box>
  );
};
