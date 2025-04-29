import { Button, Flex, Input, Text } from '@chakra-ui/react';
import {
  DepartmentEntityHydrated,
  PositionEntityEmployeeHydrated,
} from '@web/client';
import { GrayPencilIcon } from '@web/static/icons';
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
import { ChakraStylesConfig, Select } from 'chakra-react-select';

const selectStyles: ChakraStylesConfig = {
  control: (provided) => ({
    ...provided,
    border: '1px solid #E5E5E5',
    boxShadow: 'none',
    minHeight: '40px',
    padding: '0px 8px',
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '10px 12px',
    cursor: 'pointer',
  }),
  container: (provided) => ({
    ...provided,
    width: '100%',
    cursor: 'pointer',
  }),
  multiValue: (provided) => ({
    ...provided,
    padding: '6px',
  }),
};

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
    onError: (_) => {
      setLoading(false);
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
    },
  });

  const updateEmployee = useMutation({
    ...employeesControllerUpdateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: positionsControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: departmentsControllerFindAllQueryKey(),
      });
      refreshUser();
    },
  });

  const removePosition = useMutation({
    ...positionsControllerRemoveMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: positionsControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: departmentsControllerFindAllQueryKey(),
      });
      refreshUser();
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
    setLoading(false);
  };

  return (
    <>
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
                padding: '10px',
                fontSize: '16px',
                width: '100%',
                height: '40px',
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
              <GrayPencilIcon
                width="20px"
                height="20px"
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
