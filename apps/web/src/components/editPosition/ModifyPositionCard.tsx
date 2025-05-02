import { Button, Flex, Input, Text } from '@chakra-ui/react';
import {
  DepartmentEntityHydrated,
  PositionEntityEmployeeHydrated,
} from '@web/client';
import { FiEdit2 } from 'react-icons/fi';
import {
  positionsControllerUpdateMutation,
  positionsControllerFindAllQueryKey,
  positionsControllerRemoveMutation,
  employeesControllerUpdateMutation,
  departmentsControllerFindAllQueryKey,
} from '@web/client/@tanstack/react-query.gen';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';
import { RxCross2 } from 'react-icons/rx';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { RiSubtractFill } from 'react-icons/ri';
import { Toaster, toaster } from '@web/components/ui/toaster';

export const ModifyPositionCard = ({
  position,
  departments,
}: {
  position: PositionEntityEmployeeHydrated;
  departments: DepartmentEntityHydrated[];
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [positionName, setPositionName] = useState(position.name);
  const [departmentId, setDepartmentId] = useState<string | null>(
    position.department?.id || null,
  );
  const { refreshUser } = useAuth();

  const updatePosition = useMutation({
    ...positionsControllerUpdateMutation(),
    onMutate: () => {
      setLoading(true);
    },
    onError: (error) => {
      setLoading(false);
      toaster.create({
        title: 'Error',
        description: `Failed to update position: ${
          error.message || 'Please try again'
        }`,
        type: 'error',
        duration: 8000,
      });
    },
    onSuccess: () => {
      setIsEditing(false);
      setLoading(false);
      queryClient.invalidateQueries({
        queryKey: positionsControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: departmentsControllerFindAllQueryKey(),
      });
      refreshUser();
      toaster.create({
        title: 'Success',
        description: 'Position updated successfully',
        type: 'success',
        duration: 8000,
      });
    },
  });

  const updateEmployee = useMutation({
    ...employeesControllerUpdateMutation(),
    onError: (error) => {
      toaster.create({
        title: 'Error',
        description: `Failed to update employee: ${
          error.message || 'Please try again'
        }`,
        type: 'error',
        duration: 8000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: positionsControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: departmentsControllerFindAllQueryKey(),
      });
      refreshUser();
      toaster.create({
        title: 'Success',
        description: 'Employee updated successfully',
        type: 'success',
        duration: 8000,
      });
    },
  });

  const removePosition = useMutation({
    ...positionsControllerRemoveMutation(),
    onError: (error) => {
      setLoading(false);
      setIsDeleteConfirmOpen(false);
      toaster.create({
        title: 'Error',
        description: `Failed to delete position: ${
          error.message || 'Please try again'
        }`,
        type: 'error',
        duration: 8000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: positionsControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: departmentsControllerFindAllQueryKey(),
      });
      refreshUser();
      toaster.create({
        title: 'Success',
        description: 'Position deleted successfully',
        type: 'success',
        duration: 8000,
      });
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setPositionName(position.name);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (positionName.trim() === '' || departmentId === null) {
      toaster.create({
        title: 'Error',
        description: 'Position name and department are required',
        type: 'error',
        duration: 8000,
      });
      return;
    }
    updatePosition.mutate({
      body: {
        name: positionName,
        departmentId: departmentId,
      },
      path: {
        id: position.id,
      },
    });
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(
        position.employees.map((employee) => {
          return updateEmployee.mutate({
            path: {
              id: employee.id,
            },
            body: {
              positionId: null,
            },
          });
        }),
      );

      await removePosition.mutateAsync({
        path: {
          id: position.id,
        },
      });
    } catch (error) {
      console.error('Failed to delete position:', error);
    } finally {
      setIsDeleteConfirmOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Flex
        borderRadius="5px"
        bg="#FFF"
        boxShadow="0px 3px 4px 0px rgba(0, 0, 0, 0.05)"
        padding="13px 16px"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        gapX="30px"
      >
        {isEditing ? (
          <Flex flexDirection="column" width="100%" gap="10px">
            <Input
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              fontSize="16px"
              width="100%"
              autoFocus
              padding="10px"
              borderRadius="6px"
              border="1px solid #C0C0C0"
              height="40px"
              _focus={{
                outline: 'none',
                boxShadow: 'none',
                borderColor: '#929292',
              }}
            />
            <select
              id="departmentDropdown"
              placeholder="Select your department"
              onChange={(e) => {
                setDepartmentId(e.target.value);
              }}
              style={{
                marginTop: '8px',
                border: '1px solid #C0C0C0',
                borderRadius: '6px',
                paddingLeft: '8px',
                fontSize: '16px',
                width: '100%',
                height: '40px',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                color: '#000',
                backgroundImage: `url('/dropdown_arrow_down.svg')`,
                backgroundPosition: 'right 10px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '8px',
                paddingRight: '30px',
              }}
            >
              <option value="" disabled selected>
                Select your department
              </option>
              {departments?.map((department: DepartmentEntityHydrated) => (
                <option
                  key={department.name}
                  value={department.id}
                  selected={department.id === departmentId}
                >
                  {department.name}
                </option>
              ))}
            </select>
          </Flex>
        ) : (
          <Flex flexDir="column" width="100%">
            <Text fontSize="16px" fontWeight="400" lineHeight="21px">
              {position.name}
            </Text>
            <Text
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              color="#6C757D"
            >
              {position.employees.length} Employee
              {position.employees.length !== 1 ? 's' : ''}
            </Text>
            <Text
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              color="#6C757D"
            >
              {position?.department
                ? position.department.name
                : 'No Department'}
            </Text>
          </Flex>
        )}
        <Flex alignItems="center" gap="12px">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                border="1px solid #1367EA"
              >
                <RxCross2 color="#1367EA" />
              </Button>
              <Button
                onClick={handleSave}
                loading={isLoading}
                padding="4px 20px"
                borderRadius="6px"
                border="1px solid #1367EA"
                backgroundColor="#1367EA"
                color="#FFF"
                fontWeight="700"
                lineHeight="20px"
                maxWidth="72px"
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <FiEdit2
                size={20}
                color="#4A5568"
                cursor="pointer"
                onClick={handleEdit}
              />
              <Button
                color="#515151"
                background="#EEE"
                size="xs"
                onClick={() => setIsDeleteConfirmOpen(true)}
              >
                <RiSubtractFill color="#515151" size="20px" />
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      <DeleteConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        deleteObjectType="Position"
        deleteObjectName={position.name}
        isLoading={isLoading}
      />
    </>
  );
};
