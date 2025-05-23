import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  DepartmentEntity,
  EmployeeBaseEntityResponse,
  FieldGroupBaseEntity,
  PositionBaseEntity,
} from '@web/client';
import { ContextAssignedGroupData } from '@web/context/types';
import { SignatureDropdownSelect } from './SignatureDropdownSelect';
import { OptionType } from './types';

export const SignatureDropdown = ({
  field,
  border,
  background,
  positions,
  employees,
  departments,
  assignedGroupData,
  setAssignedGroupData,
}: {
  field: FieldGroupBaseEntity;
  border: string;
  background: string;
  positions?: PositionBaseEntity[];
  employees?: EmployeeBaseEntityResponse[];
  departments?: DepartmentEntity[];
  assignedGroupData: ContextAssignedGroupData[];
  setAssignedGroupData: Dispatch<SetStateAction<ContextAssignedGroupData[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<string>('Employee');
  const [options, setOptions] = useState<OptionType[]>(
    employees?.map((emp) => ({
      value: emp.id,
      label: `${emp.firstName} ${emp.lastName}`,
    })) || [],
  );

  // Update options when the active tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'Employee':
        setOptions(
          employees?.map((emp) => ({
            value: emp.id,
            label: `${emp.firstName} ${emp.lastName}`,
          })) || [],
        );
        break;
      case 'Role':
        setOptions(
          positions?.map((role) => ({ value: role.id, label: role.name })) ||
            [],
        );
        break;
      case 'Department':
        setOptions(
          departments?.map((dept) => ({ value: dept.id, label: dept.name })) ||
            [],
        );
        break;
    }
  }, [activeTab, employees, positions, departments]);

  const SignatureGroupItem = ({
    name,
    color,
    borderColor,
  }: {
    name: string;
    color: string;
    borderColor: string;
  }) => {
    return (
      <Flex gap="10px" alignItems="center">
        <Box
          w="24px"
          h="24px"
          backgroundColor={color}
          border={`1px solid ${borderColor}`}
        />
        <Text fontSize="16px" fontWeight="400" whiteSpace="nowrap">
          {name}
        </Text>
      </Flex>
    );
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Remove any existing assignment for this field group when switching tabs
    setAssignedGroupData((prev) =>
      prev.filter((group) => group.fieldGroupId !== field.id),
    );
  };

  return (
    <Box w="100%">
      <Heading as="h3" color="black" marginTop="7px">
        <SignatureGroupItem
          name={field.name}
          color={background}
          borderColor={border}
        />
      </Heading>
      <VStack align="start" marginTop="12px">
        <HStack
          width="360px"
          gap="0px"
          borderWidth="1px"
          borderRadius="4px"
          overflow="hidden"
        >
          {['Employee', 'Role', 'Department'].map((tab) => (
            <Button
              key={tab}
              onClick={() => handleTabChange(tab)}
              flex="1"
              borderRadius="0"
              borderWidth="1px"
              backgroundColor={activeTab === tab ? 'blue.50' : 'white'}
              color={activeTab === tab ? '#1367EA' : '#63646B'}
              fontWeight={activeTab === tab ? '550' : '500'}
              _hover={{ backgroundColor: 'blue.100' }}
            >
              {tab}
            </Button>
          ))}
        </HStack>
        <Box w="100%">
          <SignatureDropdownSelect
            assignedGroupData={assignedGroupData}
            setAssignedGroupData={setAssignedGroupData}
            isMulti={activeTab === 'Employee'}
            fieldGroup={field}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            options={options}
          />
        </Box>
      </VStack>
    </Box>
  );
};
