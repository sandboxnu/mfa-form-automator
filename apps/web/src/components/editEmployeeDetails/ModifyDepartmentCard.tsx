import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { DepartmentEntity } from '@web/client';
import { GrayPencilIcon } from '@web/static/icons';
import {
  departmentsControllerFindAllQueryKey,
  departmentsControllerUpdateMutation,
} from '@web/client/@tanstack/react-query.gen';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { useAuth } from '@web/hooks/useAuth';
import { RxCross2 } from 'react-icons/rx';

export const ModifyDepartmentCard = ({
  department,
}: {
  department: DepartmentEntity;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [departmentName, setDepartmentName] = useState(department.name);
  const { refreshUser } = useAuth();

  const updateDepartment = useMutation({
    ...departmentsControllerUpdateMutation(),
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
        queryKey: departmentsControllerFindAllQueryKey(),
      });
      refreshUser();
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDepartmentName(department.name);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (departmentName.trim() === '') {
      return;
    }
    updateDepartment.mutate({
      body: {
        name: departmentName,
      },
      path: {
        id: department.id,
      },
    });
  };
  return (
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
        <Input
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          fontSize="16px"
          width="100%"
          autoFocus
          padding="0px 8px"
        />
      ) : (
        <Text fontSize="16px" fontWeight="400" lineHeight="21px">
          {department.name}
        </Text>
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
              padding="0px 0px"
              size="xs"
            >
              &#x2014;
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};
