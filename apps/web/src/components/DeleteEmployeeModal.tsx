import { Button, Dialog, Flex, Portal, Text } from '@chakra-ui/react';
import {
  EmployeeBaseEntity,
  FormInstanceEntity,
  SignerType,
} from '@web/client/types.gen';
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

// TODO docs
export const DeleteEmployeeModal = ({
  isOpen,
  onClose,
  employee,
}: {
  isOpen: boolean;
  onClose: () => void;
  employee?: EmployeeBaseEntity;
}) => {
  const router = useRouter();

  const subheadingStyle = {
    lineHeight: 'normal',
    color: '#010101',
    fontSize: '16px',
    fontWeight: '600',
  };

  if (!employee) {
    return null;
  }

  const handleDeleteEmployee = async () => {
    //TODO
  };

  return null;
  //   (
  //     <Dialog.Root
  //       open={isOpen}
  //       onOpenChange={onClose}
  //       closeOnInteractOutside={true}
  //     >
  //       <Portal>
  //         <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
  //         <Dialog.Positioner alignItems="center" justifyContent={'center'}>
  //           <Dialog.Content
  //             padding={'24px 32px'}
  //             gap="24px"
  //             backgroundColor="#F8F9FA"
  //             flexDir={'column'}
  //             width="559px"
  //             minHeight="554px"
  //             maxHeight="75vh"
  //             borderRadius="12px"
  //             boxShadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
  //           >
  //             <Dialog.Header>
  //               <Flex
  //                 width="100%"
  //                 flexDirection="row"
  //                 justifyContent={'space-between'}
  //                 alignItems={'center'}
  //               >
  //                 <Dialog.Title
  //                   fontFamily={'Hanken Grotesk'}
  //                   fontSize="19px"
  //                   fontWeight="19px"
  //                   lineHeight="26px"
  //                 >
  //                   Delete User?
  //                 </Dialog.Title>
  //                 <CloseIcon
  //                   onClick={onClose}
  //                   cursor="pointer"
  //                   style={{
  //                     width: '19px',
  //                     height: '19px',
  //                   }}
  //                 />
  //               </Flex>
  //             </Dialog.Header>
  //             <Dialog.Body>
  //               <Flex flexDirection="column" alignItems="flex-start" gap="24px">
  //                 <Flex
  //                   flexDirection="column"
  //                   alignItems="flex-start"
  //                   gap="8px"
  //                   alignSelf="stretch"
  //                 >
  //                   <Text style={subheadingStyle}>Description</Text>
  //                   <Text color="#222324" fontSize="16px" fontWeight="400">
  //                     {`Are you sure you want to remove ${employee.firstName} ${employee.lastName} from the employee directory?`}
  //                   </Text>
  //                 </Flex>
  //               </Flex>
  //             </Dialog.Body>
  //           </Dialog.Content>
  //         </Dialog.Positioner>
  //       </Portal>
  //     </Dialog.Root>
  //   );
};
