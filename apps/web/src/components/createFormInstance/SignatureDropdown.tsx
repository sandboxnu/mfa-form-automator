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
  CreateAssignedGroupDto,
  DepartmentEntity,
  EmployeeEntity,
  FieldGroupBaseEntity,
  PositionEntity,
  SignerType,
} from '@web/client';
import { Select } from 'chakra-react-select';
import { ContextAssignedGroupData } from '@web/context/types';

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
  const [options, setOptions] = useState<any[]>(employees || []);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);

  // prefill dropdown if assigned group exists
  useEffect(() => {
    const assignedGroup = assignedGroupData.find(
      (group) => group.fieldGroupId === field.id,
    );

    if (!assignedGroup) return;

    const signerType = assignedGroup.signerType;

    switch (signerType) {
      case SignerType.USER:
        setActiveTab('Employee');
        setSelectedOption({
          value: assignedGroup.signerEmployeeId,
          label: assignedGroup.name,
        });
        break;
      case SignerType.POSITION:
        setActiveTab('Role');
        setSelectedOption({
          value: assignedGroup.signerPositionId,
          label: assignedGroup.name,
        });
        break;
      case SignerType.DEPARTMENT:
        setActiveTab('Department');
        setSelectedOption({
          value: assignedGroup.signerDepartmentId,
          label: assignedGroup.name,
        });
        break;
    }
  }, [assignedGroupData, field.id]);

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
        <VStack align="start" spacing="8px" marginTop="12px">
          <HStack
            width="360px"
            spacing="0px"
            borderWidth="1px"
            borderRadius="4px"
            overflow="hidden"
          >
            {['Employee', 'Role', 'Department'].map((tab) => (
              <Button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedOption(null);
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
            <Select
              useBasicStyles
              selectedOptionStyle="check"
              options={options}
              onChange={(selected) => {
                setSelectedOption(selected);

                // create assigned group object
                const assignedGroup: ContextAssignedGroupData = {
                  name: selected.label,
                  order: field.order,
                  fieldGroupId: field.id,
                  signerType: getSignerType(activeTab),
                  signerEmployeeList: [],
                };
                assignedGroup[
                  activeTab === 'Employee'
                    ? 'signerEmployeeId'
                    : activeTab === 'Role'
                    ? 'signerPositionId'
                    : 'signerDepartmentId'
                ] = selected?.value;

                // if the group id already exists, update it
                for (let i = 0; i < assignedGroupData.length; i++) {
                  if (assignedGroupData[i].fieldGroupId === field.id) {
                    assignedGroupData[i] = assignedGroup;
                    setAssignedGroupData(assignedGroupData);
                    return;
                  }
                }

                // otherwise, add it to the list
                setAssignedGroupData([...assignedGroupData, assignedGroup]);
              }}
              value={selectedOption}
            />
          </Box>
        </VStack>
      </Box>
    </>
  );
};
