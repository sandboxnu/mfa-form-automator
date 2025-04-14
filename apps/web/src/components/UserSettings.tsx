import { Dialog, Portal, Flex, Input, Text, Button } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DepartmentEntity, PositionEntity } from '@web/client';
import {
  departmentsControllerFindAllOptions,
  employeesControllerUpdateMutation,
  positionsControllerFindAllInDepartmentOptions,
} from '@web/client/@tanstack/react-query.gen';
import { useAuth } from '@web/hooks/useAuth';
import { CloseIcon } from '@web/static/icons';
import { useRef, useState } from 'react';
import { SignaturePad } from './SignaturePad';
import SignatureCanvas from 'react-signature-canvas';
import { createSignatureImage } from '@web/utils/signatureUtils';

export interface UserSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}

export const UserSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
}: UserSettingsProps) => {
  const { user, refreshUser } = useAuth();

  const [currentDepartmentId, setCurrentDepartmentId] = useState<
    string | undefined
  >(user?.departmentId ?? undefined);
  const [currentPositionId, setCurrentPositionId] = useState<
    string | undefined
  >(user?.positionId ?? undefined);
  const [createSignatureType, setCreateSignatureType] =
    useState<string>('draw');
  const [signatureText, setSignatureText] = useState<string>('');
  const signatureCanvas = useRef<SignatureCanvas>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { data: departmentsData } = useQuery({
    ...departmentsControllerFindAllOptions({
      query: {
        limit: 1000,
      },
    }),
  });
  const { data: positionsData } = useQuery({
    ...positionsControllerFindAllInDepartmentOptions({
      path: {
        departmentId: currentDepartmentId || '',
      },
      query: {
        limit: 1000,
      },
    }),
    enabled: !!currentDepartmentId,
  });

  const updateEmployee = useMutation({
    ...employeesControllerUpdateMutation(),
    onMutate: () => {
      setLoading(true);
    },
    onError: (error) => {
      setLoading(false);
    },
    onSuccess: () => {
      setSignatureText('');
      setCreateSignatureType('draw');
      refreshUser();
      setLoading(false);
      setIsSettingsOpen(false);
    },
  });

  const saveAccountSettings = async () => {
    if (!user) {
      return;
    }
    const newSignatureLink = await createSignatureImage(
      createSignatureType,
      signatureText,
      signatureCanvas,
    );

    await updateEmployee.mutateAsync({
      path: {
        id: user?.id,
      },
      body: {
        signatureLink: newSignatureLink ?? user?.signatureLink,
        positionId: currentPositionId,
      },
    });
  };

  return (
    <Dialog.Root
      open={isSettingsOpen}
      onOpenChange={(e) => setIsSettingsOpen(e.open)}
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
            minW="559px"
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
                <Dialog.Title pr="12px" py="10px">
                  <Text
                    fontFamily={'Hanken Grotesk'}
                    fontSize="30px"
                    fontWeight={600}
                  >
                    Account Settings
                  </Text>
                </Dialog.Title>
                <CloseIcon
                  onClick={() => setIsSettingsOpen(false)}
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
                  <Text>Email</Text>
                  <Input
                    value={'Jane.Doe@mfa.com'}
                    disabled={true}
                    outlineColor={'black'}
                  ></Input>
                  <Flex width="100%" flexDirection="column">
                    <label htmlFor="departmentDropdown">Department</label>
                    <select
                      id="departmentDropdown"
                      placeholder="Select your department"
                      onChange={(e) => setCurrentDepartmentId(e.target.value)}
                      // disabled until we know if users should have perms for this
                      disabled={true}
                      style={{
                        marginTop: '8px',
                        border: '1px solid #C0C0C0',
                        borderRadius: '6px',
                        padding: '10px',
                      }}
                    >
                      {departmentsData?.map((department: DepartmentEntity) => (
                        <option
                          key={department.name}
                          value={department.id}
                          selected={department.id === currentDepartmentId}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </Flex>

                  <Flex width="100%" flexDirection="column">
                    <label htmlFor="positionDropdown">Position</label>
                    <select
                      id="positionDropdown"
                      placeholder="Select your position"
                      onChange={(e) => setCurrentPositionId(e.target.value)}
                      // disabled until we know if users should have perms for this
                      // disabled={!currentDepartmentId}
                      disabled={true}
                      style={{
                        marginTop: '8px',
                        border: '1px solid #C0C0C0',
                        borderRadius: '6px',
                        padding: '10px',
                      }}
                    >
                      {positionsData?.map((position: PositionEntity) => (
                        <option
                          key={position.name}
                          value={position.id}
                          selected={position.id === currentPositionId}
                        >
                          {position.name}
                        </option>
                      ))}
                    </select>
                  </Flex>
                  <SignaturePad
                    createSignatureType={createSignatureType}
                    setCreateSignatureType={setCreateSignatureType}
                    signature={signatureText}
                    setSignature={setSignatureText}
                    signatureCanvas={signatureCanvas}
                    signatureLink={user?.signatureLink}
                  />
                </Flex>
              </Flex>
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                w="74px"
                h="36px"
                borderRadius="6px"
                borderWidth="1.5px"
                borderStyle={'solid'}
                alignContent={'center'}
                onClick={saveAccountSettings}
                loading={loading}
                disabled={loading}
                backgroundColor="#F8F9FA"
                color="#2A2B2D"
                borderColor="#C0C0C0"
              >
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
