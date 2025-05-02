import { Button, Dialog, Flex, Portal, Text } from '@chakra-ui/react';
import { FormInstanceEntity, SignerType } from '@web/client/types.gen';
import { useRouter } from 'next/router';
import { CloseIcon, PenSigningIcon } from '@web/static/icons';
import { getNameFromAssignedGroup } from '@web/utils/formInstanceUtils';
import { useAuth } from '@web/hooks/useAuth';
import AssigneeMap from './AssigneeMap';
import { Avatar } from './ui/avatar.tsx';
import { nextSigner, signerIsUser } from '@web/utils/formInstanceUtils';
import { useRouterContext } from '@web/context/RouterProvider.tsx';
import { getIsActive } from '@web/utils/misc.ts';
import { FiExternalLink, FiTrash2 } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import { DeleteConfirmModal } from './DeleteConfirmModal.tsx';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllQueryKey,
  formInstancesControllerRemoveMutation,
} from '@web/client/@tanstack/react-query.gen.ts';
import { Toaster, toaster } from './ui/toaster.tsx';
import { queryClient } from '@web/pages/_app.tsx';
import { formInstancesControllerFindAllAssignedToCurrentEmployee } from '@web/client/sdk.gen.ts';

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
  const { isRouteChanging } = useRouterContext();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const removeForminstance = useMutation({
    ...formInstancesControllerRemoveMutation(),
    onMutate: () => {
      setIsDeleteLoading(true);
    },
    onError: (error) => {
      setIsDeleteLoading(false);
      toaster.create({
        title: 'Error',
        description: `Failed to delete form instance: ${
          error.message || 'Please try again'
        }`,
        type: 'error',
        duration: 8000,
      });
    },
    onSuccess: () => {
      setIsDeleteLoading(false);
      setIsDeleteConfirmOpen(false);
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
      });
      toaster.create({
        title: 'Success',
        description: 'Form instance deleted successfully',
        type: 'success',
        duration: 8000,
      });
      onClose();
    },
  });

  const handleDelete = () => {
    if (!formInstance) return;

    removeForminstance.mutate({
      path: {
        id: formInstance.id,
      },
    });
  };

  const subheadingStyle = {
    lineHeight: 'normal',
    color: '#010101',
    fontSize: '16px',
    fontWeight: '600',
  };

  if (!formInstance || !user) {
    return <></>;
  }

  const openForm = () => {
    const url =
      formInstance.assignedGroups[formInstance.assignedGroups.length - 1]
        .signedDocLink ?? formInstance.formDocLink;
    if (url) {
      window.open(url, '_blank');
    }
  };

  const nextAssignedGroup = nextSigner(formInstance);

  return (
    <>
      <Toaster />
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
                          isActive: getIsActive(assignedGroup),
                        }),
                      )}
                    />
                  </Flex>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Flex width="100%" justifyContent="space-between">
                  {/* Left side buttons */}
                  <Flex gap="8px">
                    {user.id === formInstance.originator.id && (
                      <>
                        <Button
                          height="32px"
                          padding="4px 16px"
                          borderRadius="6px"
                          background="#1367EA"
                          onClick={() =>
                            router.push(
                              `/form-instance/${formInstance.id}/edit/description`,
                            )
                          }
                          _hover={{
                            background: '#1367EA',
                          }}
                          loading={isRouteChanging}
                          disabled={isRouteChanging}
                        >
                          <Flex
                            gap="8px"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <MdEdit color="#FFF" size={16} />
                          </Flex>
                        </Button>
                        <Button
                          height="32px"
                          padding="4px 16px"
                          borderRadius="6px"
                          background="#ED2324"
                          onClick={() => setIsDeleteConfirmOpen(true)}
                          _hover={{
                            background: '#ED2324',
                          }}
                          loading={isRouteChanging}
                          disabled={isRouteChanging}
                        >
                          <Flex
                            gap="8px"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <FiTrash2 color="#FFF" size={16} />
                          </Flex>
                        </Button>
                      </>
                    )}
                    <Button
                      height="32px"
                      padding="4px 16px"
                      borderRadius="6px"
                      background="#1367EA"
                      onClick={openForm}
                      _hover={{
                        background: '#1367EA',
                      }}
                    >
                      <Flex
                        gap="8px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FiExternalLink color="#FFF" size={16} />
                      </Flex>
                    </Button>
                  </Flex>

                  {/* Right side buttons */}
                  <Flex>
                    {nextAssignedGroup &&
                      signerIsUser(nextAssignedGroup, user) && (
                        <Button
                          width="158px"
                          height="32px"
                          padding="4px 16px"
                          borderRadius="6px"
                          background="#1367EA"
                          onClick={() =>
                            router.push('sign-form/' + formInstance.id)
                          }
                          _hover={{
                            background: '#1367EA',
                          }}
                          loading={isRouteChanging}
                          disabled={isRouteChanging}
                        >
                          <Flex
                            gap="8px"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <PenSigningIcon color="#FFF" />
                            <Text color="#FFF">Sign Now</Text>
                          </Flex>
                        </Button>
                      )}
                    {!nextAssignedGroup &&
                      !formInstance.markedCompleted &&
                      user.id === formInstance.originator.id && (
                        <Button
                          height="32px"
                          padding="4px 16px"
                          borderRadius="6px"
                          background="#1367EA"
                          onClick={() =>
                            router.push(`/approve-form/${formInstance.id}`)
                          }
                          _hover={{
                            background: '#1367EA',
                          }}
                          loading={isRouteChanging}
                          disabled={isRouteChanging}
                        >
                          <Flex
                            gap="8px"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <PenSigningIcon color="#FFF" />
                            <Text color="#FFF">Approve form</Text>
                          </Flex>
                        </Button>
                      )}
                  </Flex>
                </Flex>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        deleteObjectType="Form Instance"
        deleteObjectName={formInstance.name}
        isLoading={isDeleteLoading}
      />
    </>
  );
};
