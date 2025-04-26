import { Button, Dialog, Flex, Portal, Text } from '@chakra-ui/react';
import { FormInstanceEntity, SignerType } from '@web/client/types.gen';
import { useRouter } from 'next/router';
import { CloseIcon, PenSigningIcon } from '@web/static/icons';
import { getNameFromAssignedGroup } from '@web/utils/formInstanceUtils';
import { useAuth } from '@web/hooks/useAuth';
import AssigneeMap from './AssigneeMap';
import { Avatar } from './ui/avatar.tsx';
import { nextSigner, signerIsUser } from '@web/utils/formInstanceUtils';
import {
  formInstancesControllerCompleteFormInstanceMutation,
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formInstancesControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen.ts';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app.tsx';
import { useState } from 'react';

/**
 * Modal used in OverviewRow component for To Do forms
 * @param isOpen boolean which keeps track of modal open-state based on interactions in the OverviewRow component
 * @param onClose the operation that closes the modal when "X" is pressed
 * @param formInstance the instance whose info is displayed
 * @returns a modal displaying a To-Do form's status including description, assigner, and assignee flow
 */
export const SignFormInstancePreview = ({
  isOpen,
  onClose,
  formInstance,
}: {
  isOpen: boolean;
  onClose: () => void;
  formInstance?: FormInstanceEntity;
}) => {
  const router = useRouter();
  const [markedCompletedLoading, setMarkedCompletedLoading] = useState(false);
  const { user } = useAuth();

  const completeFormInstanceMutation = useMutation({
    ...formInstancesControllerCompleteFormInstanceMutation(),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey(),
      });
      router.push('/completed').then(() => {
        setMarkedCompletedLoading(false);
        onClose();
      });
    },
  });

  const subheadingStyle = {
    lineHeight: 'normal',
    color: '#010101',
    fontSize: '16px',
    fontWeight: '600',
  };

  if (!formInstance || !user) {
    return <></>;
  }

  const handleApproveFormInstance = async () => {
    setMarkedCompletedLoading(true);
    await completeFormInstanceMutation.mutateAsync({
      path: {
        formInstanceId: formInstance?.id,
      },
    });
  };

  const nextAssignedGroup = nextSigner(formInstance);

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      closeOnInteractOutside={true}
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
        <Dialog.Positioner alignItems="center" justifyContent={'center'}>
          <Dialog.Content
            padding={'24px 32px'}
            gap="24px"
            backgroundColor="#F8F9FA"
            flexDir={'column'}
            width="559px"
            minHeight="554px"
            maxHeight="75vh"
            borderRadius="12px"
            boxShadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
          >
            <Dialog.Header>
              <Flex
                width="100%"
                flexDirection="row"
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Dialog.Title
                  fontFamily={'Hanken Grotesk'}
                  fontSize="19px"
                  fontWeight="19px"
                  lineHeight="26px"
                >
                  {formInstance.name}
                </Dialog.Title>
                <CloseIcon
                  onClick={onClose}
                  cursor="pointer"
                  style={{
                    width: '19px',
                    height: '19px',
                  }}
                />
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Flex flexDirection="column" alignItems="flex-start" gap="24px">
                <Flex
                  flexDirection="column"
                  alignItems="flex-start"
                  gap="8px"
                  alignSelf="stretch"
                >
                  <Text style={subheadingStyle}>Description</Text>
                  <Text color="#222324" fontSize="16px" fontWeight="400">
                    {formInstance.description}
                  </Text>
                </Flex>
                <Flex
                  flexDirection="column"
                  justifyContent={'space-between'}
                  alignItems="flex-start"
                  alignSelf="stretch"
                  gap="12px"
                >
                  <Text style={subheadingStyle}>Assigned by</Text>
                  <Flex alignItems={'center'}>
                    <Avatar
                      name={
                        formInstance.originator.firstName +
                        ' ' +
                        formInstance.originator.lastName
                      }
                      boxSize="32px"
                      padding="6px 7px"
                      size="md"
                      color="#0C0C0C"
                      bg="#E5E5E5"
                      border="1px solid #FFFFFF"
                    />
                    <Text
                      color="#0C0C0C"
                      fontSize="15px"
                      lineHeight="20px"
                      paddingLeft="8px"
                      fontWeight="400"
                    >
                      {formInstance.originator.firstName}{' '}
                      {formInstance.originator.lastName}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  flexDirection="column"
                  justifyContent={'space-between'}
                  alignSelf={'stretch'}
                  gap="12px"
                >
                  <Text style={subheadingStyle}>Assignees</Text>
                  <AssigneeMap
                    assignees={formInstance.assignedGroups.map(
                      (assignedGroup) => ({
                        title: getNameFromAssignedGroup(assignedGroup),
                        signerType: assignedGroup.signerType as SignerType,
                        signedAt: assignedGroup.signed,
                      }),
                    )}
                  />
                </Flex>
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              {nextAssignedGroup && signerIsUser(nextAssignedGroup, user) && (
                <Button
                  width="158px"
                  height="32px"
                  padding="4px 16px"
                  borderRadius="6px"
                  background="#1367EA"
                  onClick={() => router.push('sign-form/' + formInstance.id)}
                  _hover={{
                    background: '#1367EA',
                  }}
                >
                  <Flex gap="8px" alignItems="center" justifyContent="center">
                    <PenSigningIcon color="#FFF" />

                    <Text color="#FFF">Sign Now</Text>
                  </Flex>
                </Button>
              )}
              {!nextAssignedGroup &&
                !formInstance.markedCompleted &&
                user.id === formInstance.originator.id && (
                  <Button
                    width="158px"
                    height="32px"
                    padding="4px 16px"
                    borderRadius="6px"
                    background="#1367EA"
                    onClick={handleApproveFormInstance}
                    _hover={{
                      background: '#1367EA',
                    }}
                    loading={markedCompletedLoading}
                    disabled={markedCompletedLoading}
                  >
                    <Flex gap="8px" alignItems="center" justifyContent="center">
                      <PenSigningIcon color="#FFF" />

                      <Text color="#FFF">Mark Completed</Text>
                    </Flex>
                  </Button>
                )}
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
