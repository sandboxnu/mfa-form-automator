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
  EmployeeEntity,
  FieldGroupBaseEntity,
  PositionEntity,
  SignerType,
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
  positions?: PositionEntity[];
  employees?: EmployeeEntity[];
  departments?: DepartmentEntity[];
  assignedGroupData: ContextAssignedGroupData[];
  setAssignedGroupData: Dispatch<SetStateAction<ContextAssignedGroupData[]>>;
}) => {
  const [activeTab, setActiveTab] = useState('Employee');
  const [options, setOptions] = useState<OptionType[]>(
    employees?.map((emp) => ({
      value: emp.id,
      label: `${emp.firstName} ${emp.lastName}`,
    })) || [],
  );

  // this is not ideal, we should just use on onClick handler fucntion
  // instead of useEffect
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

  const getSignerType = (tab: string): SignerType => {
    switch (tab) {
      case 'Employee':
        return SignerType.USER;
      case 'Role':
        return SignerType.POSITION;
      case 'Department':
        return SignerType.DEPARTMENT;
      default:
        return SignerType.USER;
    }
  };

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
        <Text font-size="16px" fontWeight="400" whiteSpace={'nowrap'}>
          {name}
        </Text>
      </Flex>
    );
  };

  return (
    <>
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
                onClick={() => {
                  setActiveTab(tab);
                  setAssignedGroupData((prev) =>
                    prev.filter((group) => group.fieldGroupId !== field.id),
                  );
                }}
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
    </>
  );
};
