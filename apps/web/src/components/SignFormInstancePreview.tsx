import {
  Avatar,
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { AssignedGroupEntity, FormInstanceEntity } from '@web/client/types.gen';

import { useRouter } from 'next/router';
import { CloseIcon, PenSigningIcon } from '@web/static/icons';
import AssigneeMap from './AvatarMap';
import { getNameFromAssignedGroup } from '@web/utils/formInstanceUtils';
import { useAuth } from '@web/hooks/useAuth';

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
  onClose: any;
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
    return null;
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
    // get the AssignedGroupEntity that is next to sign the form
    let nextToSign: AssignedGroupEntity | null = null;
    let prev: AssignedGroupEntity | null = null;
    for (let assigned of formInstance.assignedGroups) {
      if (prev == null || (prev.signed && !assigned.signed)) {
        nextToSign = assigned;
        break;
      }
      prev = assigned;
    }
    if (nextToSign?.signerType == 'POSITION') {
      return user?.positionId == nextToSign.signerPositionId;
    } else if (nextToSign?.signerType == 'DEPARTMENT') {
      return user?.departmentId == nextToSign.signerDepartmentId;
    } else if (nextToSign?.signerType == 'USER') {
      return user?.id == nextToSign.signerEmployee?.id;
    } else if (nextToSign?.signerType == 'USER_LIST') {
      return nextToSign.signerEmployeeList?.reduce(
        (acc, empl) => (empl.id == user?.id ? true : acc),
        false,
      );
    }
    return false;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent alignItems="center" justifyContent={'center'}>
        <Flex
          backgroundColor="#F8F9FA"
          padding="24px 32px"
          gap="24px"
          flexDirection="column"
          justifyContent={'space-between'}
          width="559px"
          minHeight="554px"
          maxHeight="75vh"
          borderRadius="12px"
          alignItems="flex-end"
          flexShrink={'0'}
          box-shadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
          overflowY={'scroll'}
        >
          <Flex
            width="495px"
            justifyContent="space-between"
            alignItems="center"
            flexDirection="column"
          >
            <Flex
              flexDirection="column"
              alignItems="flex-start"
              gap="24px"
              flex="1 0 0"
            >
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                width="495px"
              >
                <Text
                  fontFamily="Hanken Grotesk"
                  fontSize="19px"
                  fontWeight="700px"
                  lineHeight="26px"
                >
                  {formInstance.name}
                </Text>
                <CloseIcon onClick={onClose} cursor="pointer" />
              </Flex>

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
                alignItems="flex-start"
                gap="12px"
                alignSelf="stretch"
              >
                <Text style={subheadingStyle}>Assigned by</Text>
                <Flex alignItems="center" gap="8px" alignSelf="stretch">
                  <Avatar
                    name={
                      formInstance.originator.firstName +
                      ' ' +
                      formInstance.originator.lastName
                    }
                    boxSize="32px"
                    backgroundColor={'#DDD'}
                    padding="6px 7px"
                    border="1px solid #FFFFFF"
                    color="#0C0C0C"
                    size="16px"
                  />
                  <Text color="#0C0C0C" fontSize="15px">
                    {formInstance.originator.firstName +
                      ' ' +
                      formInstance.originator.lastName}
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
          </Flex>
          {nextUser() == true ? (
            <Button
              width="158px"
              height="32px"
              padding="4px 16px"
              borderRadius="6px"
              background="#1367EA"
              onClick={() => router.push('form-instances/' + formInstance.id)}
              _hover={{
                background: '#1367EA',
              }}
              justifyContent="center"
              alignItems={'center'}
            >
              <Flex gap="8px">
                <PenSigningIcon
                  color="#FFF"
                  position={'absolute'}
                  alignSelf="center"
                  left="20px"
                />

                <Text color="#FFF" position={'relative'}>
                  Sign Now
                </Text>
              </Flex>
            </Button>
          ) : (
            <></>
          )}
        </Flex>
      </ModalContent>
    </Modal>
  );
};
