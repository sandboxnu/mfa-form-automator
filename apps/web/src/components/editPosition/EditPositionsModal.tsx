import { Button, Dialog, Flex, Portal, Input, VStack } from '@chakra-ui/react';
import { CloseIcon, PlusIcon } from '@web/static/icons';
import {
  departmentsControllerFindAllOptions,
  positionsControllerCreateMutation,
  positionsControllerFindAllOptions,
  positionsControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { useMutation, useQuery } from '@tanstack/react-query';
import { RightSearchIcon } from '@web/static/icons';
import { InputGroup } from '../ui/input-group';
import { ModifyPositionCard } from './ModifyPositionCard';
import { useEffect, useState } from 'react';
import { PositionEntityEmployeeHydrated } from '@web/client';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { NewPositionCard } from './NewPositionCard';

export const EditPositionsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: positions = [] } = useQuery(
    positionsControllerFindAllOptions(),
  );
  const { data: departments = [] } = useQuery(
    departmentsControllerFindAllOptions(),
  );
  const [filteredPositions, setFilteredPositions] = useState<
    PositionEntityEmployeeHydrated[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');
  const [newPositionDepartmentId, setNewPositionDepartmentId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setIsCreatingNew(false);
      setNewPositionName('');
      setNewPositionDepartmentId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!positions) return;

    if (searchQuery.trim() === '') {
      setFilteredPositions(positions);
    } else {
      const filtered = positions.filter((position) =>
        position.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredPositions(filtered);
    }
  }, [positions, searchQuery]);

  const createPosition = useMutation({
    ...positionsControllerCreateMutation(),
    onMutate: () => {
      setIsLoading(true);
    },
    onError: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setIsLoading(false);
      setIsCreatingNew(false);
      setNewPositionName('');
      queryClient.invalidateQueries({
        queryKey: positionsControllerFindAllQueryKey(),
      });
      refreshUser();
    },
  });

  const handleAddPosition = () => {
    setIsCreatingNew(true);
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
    setNewPositionName('');
  };

  const handleSaveNewPosition = () => {
    if (newPositionName.trim() === '' || newPositionDepartmentId === null) {
      return;
    }

    createPosition.mutate({
      body: {
        name: newPositionName,
        departmentId: newPositionDepartmentId,
      },
    });
  };

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
            height="auto"
            maxHeight="75vh"
            borderRadius="12px"
            boxShadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
            overflow="hidden"
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
                  fontSize="30px"
                  fontWeight="700"
                  lineHeight="36px"
                >
                  Manage positions
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
              <Flex height="38px">
                <InputGroup
                  startElement={
                    <RightSearchIcon color="#929292" w="30px" h="30px" />
                  }
                  fontSize="16px"
                  flex="1"
                  border="1px solid #929292"
                  borderRadius="6px"
                >
                  <Input
                    placeholder="Search departments"
                    padding="4px 12px"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
                <Button
                  variant="outline"
                  ml="4"
                  padding="4px 12px"
                  bg="#1367EA"
                  color="white"
                  borderRadius="6px"
                  onClick={handleAddPosition}
                  disabled={isCreatingNew}
                >
                  <PlusIcon
                    boxSize="14px"
                    fill="white"
                    stroke="white"
                    stroke-width="0.38"
                  />
                  add position
                </Button>
              </Flex>
              <VStack
                spaceY="10px"
                mt="26px"
                alignItems="flex-start"
                height="500px"
                maxHeight="calc(75vh - 180px)"
                overflowY="auto"
                scrollbar="hidden"
              >
                {isCreatingNew && (
                  <NewPositionCard
                    positionName={newPositionName}
                    setPositionName={setNewPositionName}
                    onCancel={handleCancelCreate}
                    onSave={handleSaveNewPosition}
                    isLoading={isLoading}
                    departments={departments}
                    setNewPositionDepartmentId={setNewPositionDepartmentId}
                  />
                )}
                {filteredPositions.map((position) => (
                  <ModifyPositionCard
                    key={position.id}
                    position={position}
                    departments={departments}
                  />
                ))}
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
