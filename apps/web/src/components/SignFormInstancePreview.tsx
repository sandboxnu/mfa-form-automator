import {
  Avatar,
  background,
  Button,
  Flex,
  Modal,
  ModalContent,
  Text,
} from '@chakra-ui/react';
import {
  AssignedGroupEntity,
  EmployeeEntity,
  FormInstanceEntity,
} from '@web/client/types.gen';

import { useRouter } from 'next/router';
import { CloseIcon, PenSigningIcon } from '@web/static/icons';
import { MouseEventHandler } from 'react';
import AssigneeMap from './AvatarMap';
import { getNameFromAssignedGroup } from '@web/utils/formInstanceUtils';

export const SignFormInstancePreview = ({
  isOpen,
  closeFunction,
  formInstance,
}: {
  isOpen: boolean;
  closeFunction: any;
  formInstance: FormInstanceEntity;
}) => {
  const lineStyle = {
    width: '1px',
    height: '33px',
    position: 'absolute',
    left: '16.5px',
    background: '#A1A1A1',
  };
  const router = useRouter();

  const subheadingStyle = {
    lineHeight: 'normal',
    color: '#010101',
    fontSize: '16px',
    fontWeight: '600',
  };

  const RowItem = ({ signer }: { signer: AssignedGroupEntity }) => {
    return (
      <Flex
        flexDirection={'column'}
        alignItems="flex-start"
        gap="-4px"
        alignSelf="stretch"
      >
        <Flex alignItems={'center'} gap="8px">
          <Flex flex="1 0 0">
            <Text>Name</Text>
            <Text>{signer.signed ? <Flex></Flex> : 'awaiting'}</Text>
          </Flex>
        </Flex>
        <Flex></Flex>
      </Flex>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={closeFunction}>
      <ModalContent>
        <Flex
          zIndex="10000"
          backgroundColor="#F8F9FA"
          padding="24px 32px"
          gap="24px"
          flexDirection="column"
          width="559px"
          height="554px"
          borderRadius="12px"
          box-shadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
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
                <CloseIcon onClick={closeFunction} />
              </Flex>

              <Flex
                flexDirection="column"
                alignItems="flex-start"
                gap="8px"
                alignSelf="stretch"
              >
                <Text style={subheadingStyle}>Description</Text>
                <Text color="#222324" fontSize="16px" fontWeight="400">
                  For HR needs lorem ipsum dolor sit amet. Consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
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
                    boxSize="36px"
                    backgroundColor={'#DDD'}
                    border="1px solid #FFFFFF"
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
          <Button
            display={'flex'}
            alignSelf="right"
            width="158px"
            height="32px"
            padding="4px 16px"
            justifyContent={'center'}
            alignItems="center"
            gap="8px"
            borderRadius="6px"
            backgroundColor="#1367EA"
            color="#FFF"
            onClick={() => router.push('form-instances/' + formInstance.id)}
            _hover={{
              background: '#1367EA',
              color: '#FFF',
            }}
            border="1px solid var(--Blue, #1367EA)"
          >
            <PenSigningIcon color="#FFF" />
            Sign Now
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
