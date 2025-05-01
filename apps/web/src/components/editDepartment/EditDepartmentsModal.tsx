import { Button, Dialog, Flex, Portal, Input, VStack } from '@chakra-ui/react';
import { CloseIcon, PlusIcon } from '@web/static/icons';
import {
  departmentsControllerFindAllOptions,
  departmentsControllerCreateMutation,
  departmentsControllerFindAllQueryKey,
  positionsControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { useQuery, useMutation } from '@tanstack/react-query';
import { InputGroup } from '../ui/input-group';
import { ModifyDepartmentCard } from './ModifyDepartmentCard';
import { useState, useEffect } from 'react';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';
import { NewDepartmentCard } from './NewDepartmentCard';
import { DepartmentEntityHydrated } from '@web/client';
import { MdOutlineSearch } from 'react-icons/md';
import { Toaster, toaster } from '@web/components/ui/toaster';

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
      setIsCreatingNew(false);
      setNewDepartmentName('');
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
    onError: (error) => {
      setIsLoading(false);
      toaster.create({
        title: 'Error',
        description: `Failed to create department: ${
          error.message || 'Please try again.'
        }`,
        type: 'error',
        duration: 8000,
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      setIsCreatingNew(false);
      setNewDepartmentName('');
      queryClient.invalidateQueries({
        queryKey: departmentsControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: positionsControllerFindAllQueryKey(),
      });
      refreshUser();
      toaster.create({
        title: 'Success',
        description: 'Department created successfully',
        type: 'success',
        duration: 8000,
      });
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
      toaster.create({
        title: 'Error',
        description: 'Department name cannot be empty',
        type: 'error',
        duration: 8000,
      });
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
            <Toaster />
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
                  fontSize="16px"
                  flex="1"
                  startElement={
                    <MdOutlineSearch
                      color="#929292"
                      size="20px"
                      style={{
                        marginLeft: '8px',
                        marginRight: '8px',
                      }}
                    />
                  }
                >
                  <Input
                    placeholder="Search departments"
                    padding="4px 12px"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    _focus={{
                      outline: 'none',
                      boxShadow: 'none',
                      borderColor: '#929292',
                    }}
                    borderRadius="6px"
                    border="1px solid #929292"
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
                  Add department
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
