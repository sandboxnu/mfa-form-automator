import { Button, Dialog, Flex, Portal, Input, VStack } from '@chakra-ui/react';
import { CloseIcon, PlusIcon } from '@web/static/icons';
import {
  departmentsControllerFindAllOptions,
  departmentsControllerCreateMutation,
  departmentsControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { useQuery, useMutation } from '@tanstack/react-query';
import { RightSearchIcon } from '@web/static/icons';
import { InputGroup } from '../ui/input-group';
import { ModifyDepartmentCard } from './ModifyDepartmentCard';
import { useState, useEffect } from 'react';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';
import { NewDepartmentCard } from './NewDepartmentCard';
import { DepartmentEntityHydrated } from '@web/client';

export const EditDepartmentsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: departments = [] } = useQuery(
    departmentsControllerFindAllOptions(),
  );
  const [filteredDepartments, setFilteredDepartments] = useState<
    DepartmentEntityHydrated[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!departments) return;

    if (searchQuery.trim() === '') {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredDepartments(filtered);
    }
  }, [departments, searchQuery]);

  const createDepartment = useMutation({
    ...departmentsControllerCreateMutation(),
    onMutate: () => {
      setIsLoading(true);
    },
    onError: () => {
      setIsLoading(false);
    },
    onSuccess: () => {
      setIsLoading(false);
      setIsCreatingNew(false);
      setNewDepartmentName('');
      queryClient.invalidateQueries({
        queryKey: departmentsControllerFindAllQueryKey(),
      });
      refreshUser();
    },
  });

  const handleAddDepartment = () => {
    setIsCreatingNew(true);
  };

  const handleCancelCreate = () => {
    setIsCreatingNew(false);
    setNewDepartmentName('');
  };

  const handleSaveNewDepartment = () => {
    if (newDepartmentName.trim() === '') {
      return;
    }

    createDepartment.mutate({
      body: {
        name: newDepartmentName,
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
                  Manage departments
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
                  onClick={handleAddDepartment}
                  disabled={isCreatingNew}
                >
                  <PlusIcon
                    boxSize="14px"
                    fill="white"
                    stroke="white"
                    strokeWidth="0.38"
                  />
                  add department
                </Button>
              </Flex>
              <VStack
                spaceY="10px"
                mt="26px"
                alignItems="flex-start"
                width="100%"
                height="500px"
                maxHeight="calc(75vh - 180px)"
                overflowY="auto"
                scrollbar="hidden"
              >
                {isCreatingNew && (
                  <NewDepartmentCard
                    departmentName={newDepartmentName}
                    setDepartmentName={setNewDepartmentName}
                    onCancel={handleCancelCreate}
                    onSave={handleSaveNewDepartment}
                    isLoading={isLoading}
                  />
                )}
                {filteredDepartments.map((department) => (
                  <ModifyDepartmentCard
                    key={department.id}
                    department={department}
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
