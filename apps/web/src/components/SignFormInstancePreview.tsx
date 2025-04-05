import { Button, Dialog, Flex, Portal, Text } from '@chakra-ui/react';
import { AssignedGroupEntity, FormInstanceEntity } from '@web/client/types.gen';
import { useRouter } from 'next/router';
import { CloseIcon, PenSigningIcon } from '@web/static/icons';
import { getNameFromAssignedGroup } from '@web/utils/formInstanceUtils';
import { useAuth } from '@web/hooks/useAuth';
import AssigneeMap from './AssigneeMap';
import { Avatar } from './ui/avatar.tsx';

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
  const { user } = useAuth();

  const subheadingStyle = {
    lineHeight: 'normal',
    color: '#010101',
    fontSize: '16px',
    fontWeight: '600',
  };

  if (!formInstance) {
    return <></>;
  }

  /**
   * Determines whether the currently logged in user qualifies as 'next to sign' based on
   * their position/department/identity.  Used to determine whether the user should have the option to
   * "Sign Now" from this form instance preview modal.
   * @returns a boolean representing whether or not the user can sign for the next assigned group
   */
  function nextUser() {
    if (!formInstance) {
      return false;
    }

    const nextToSign = formInstance.assignedGroups.find(
      (group) => !group.signed,
    );
    if (!nextToSign) {
      return false;
    }

    switch (nextToSign.signerType) {
      case 'POSITION':
        return user?.positionId === nextToSign.signerPositionId;
      case 'DEPARTMENT':
        return user?.departmentId === nextToSign.signerDepartmentId;
      case 'USER':
        return user?.id === nextToSign.signerEmployee?.id;
      case 'USER_LIST':
        return nextToSign.signerEmployeeList?.reduce(
          (acc, empl) => (empl.id == user?.id ? true : acc),
          false,
        );
      default:
        return false;
    }
  }

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
            overflowY={'scroll'}
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
                        signed: assignedGroup.signed,
                        title: getNameFromAssignedGroup(assignedGroup),
                        signerType: assignedGroup.signerType as any,
                        updatedAt: assignedGroup.updatedAt,
                      }),
                    )}
                  />
                </Flex>
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              {nextUser() && (
                <Button
                  width="158px"
                  height="32px"
                  padding="4px 16px"
                  borderRadius="6px"
                  background="#1367EA"
                  onClick={() =>
                    router.push('form-instances/' + formInstance.id)
                  }
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
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
