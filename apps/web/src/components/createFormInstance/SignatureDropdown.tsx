import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
} from '@chakra-ui/react';
import { DropdownDownArrow, DropdownUpArrow } from '@web/static/icons';
import { chakraComponents, Select } from 'chakra-react-select';
import { useEffect, useState } from 'react';
import { AssignedGroupData, PositionOption } from './types';
import { SearchIcon } from '@web/static/icons';
import {
  DepartmentEntity,
  EmployeeEntity,
  FieldGroupBaseEntity,
  PositionEntity,
} from '@web/client';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

const assigneePlaceholderWithIcon = (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <SearchIcon />
    <span style={{ marginLeft: '8px' }}>Select assignee</span>
  </div>
);

export const SignatureDropdown = ({
  field,
  index,
  positions,
  employees,
  departments,
  assignedGroupData,
  setAssignedGroupData,
}: {
  field: FieldGroupBaseEntity;
  index: number;
  positions?: PositionEntity[];
  employees?: EmployeeEntity[];
  departments?: DepartmentEntity[];
  assignedGroupData: AssignedGroupData[];
  setAssignedGroupData: (updatedAssignedGroupData: AssignedGroupData[]) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Employee');
  const [selectedPosition, setSelectedPosition] =
    useState<PositionOption | null>();
  const [options, setOptions] = useState<PositionOption[]>([]);
  const { formTemplate } = useCreateFormInstance();

  /**
   * Reset signature positions when form template changes
   */
  useEffect(() => {
    if (!formTemplate) return;

    setAssignedGroupData(
      formTemplate.fieldGroups.map((_, i) => {
        return {
          fieldGroupId: formTemplate?.fieldGroups[i].id!,
          order: i,
        };
      }),
    );
  }, [formTemplate, setAssignedGroupData]);

  /**
   * Get filtered options based on active tab
   */
  useEffect(() => {
    const getFilteredOptions = async () => {
      let data;
      switch (activeTab) {
        case 'Employee':
          data = employees;
          setOptions(
            data?.map((emp) => ({
              value: emp.id,
              label: `${emp.firstName} ${emp.lastName}`,
            })) || [],
          );
          break;
        case 'Role':
          data = positions;
          setOptions(
            data?.map((role) => ({ value: role.id, label: role.name })) || [],
          );
          break;
        case 'Department':
          data = departments;
          setOptions(
            data?.map((dept) => ({ value: dept.id, label: dept.name })) || [],
          );
          break;
      }
    };

    getFilteredOptions();
  }, [activeTab, employees, positions, departments]);

  const groupColors = [
    ['#1367EA', '#EEF5FF'],
    ['#BD21CA', '#FDEAFF'],
    ['#7645E8', '#ECE4FF'],
    ['#567E26', '#EDFFD6'],
    ['#A16308', '#FFFDDB'],
  ];

  const GroupItem = ({
    num,
    color,
    border,
  }: {
    num: number;
    color: string;
    border: string;
  }) => {
    return (
      <Flex gap="10px" alignItems="center">
        <Box
          width="24px"
          height="24px"
          backgroundColor={color}
          border={`1px solid ${border}`}
        />
        <Text font-size="16px" fontWeight="400" whiteSpace={'nowrap'}>
          Group {num}
        </Text>
      </Flex>
    );
  };

  const [border, background] = groupColors[index % groupColors.length];

  return (
    <Box w="100%">
      <Flex w="100%" justifyContent="space-between" paddingBottom="6px">
        <Heading as="h3" color="black" marginTop="7px">
          <GroupItem
            key={index}
            num={index + 1}
            color={background}
            border={border}
          />
        </Heading>
        <VStack align="start" spacing="8px">
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
                onClick={() => setActiveTab(tab)}
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
          <Box width="100%">
            <Select
              useBasicStyles
              selectedOptionStyle="check"
              options={options}
              placeholder={assigneePlaceholderWithIcon}
              value={selectedPosition}
              onChange={(selected) => {
                setSelectedPosition(selected);
                // TODO: probably should not be coercing this type
                let updatedAssignedGroupData = assignedGroupData.at(index)!;
                updatedAssignedGroupData.positionId = selected?.value;
                assignedGroupData[index] = {
                  ...updatedAssignedGroupData,
                  fieldGroupId: updatedAssignedGroupData?.fieldGroupId,
                  positionId: selected?.value,
                  order: updatedAssignedGroupData?.order,
                };
                setAssignedGroupData(assignedGroupData);
              }}
              className="custom-dropdown"
              components={{
                DropdownIndicator: (props: any) => (
                  <chakraComponents.DropdownIndicator {...props}>
                    {isDropdownOpen ? (
                      <DropdownUpArrow maxH="7px" />
                    ) : (
                      <DropdownDownArrow maxH="7px" />
                    )}
                  </chakraComponents.DropdownIndicator>
                ),
              }}
              onMenuOpen={() => setIsDropdownOpen(true)}
              onMenuClose={() => setIsDropdownOpen(false)}
              isClearable
              closeMenuOnSelect
            />
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};
