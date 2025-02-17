import { Box, Button, Flex, Heading, HStack, VStack, Text } from '@chakra-ui/react';
import { DropdownDownArrow, DropdownUpArrow } from '@web/static/icons';
import { chakraComponents, Select } from 'chakra-react-select';
import { useState } from 'react';
import { Option } from './types';
import { SearchIcon } from '@web/static/icons';
import { SignatureFieldEntity, PositionEntity, SignatureEntity } from '@web/client';

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
  signaturePositions,
  setSignaturePositions,
}: {
  field: SignatureFieldEntity;
  index: number;
  positions?: PositionEntity[];
  signaturePositions: (Option | null)[];
  setSignaturePositions: (updatedSignaturePositions: (Option | null)[]) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Employee");

  /**
   * Get the employee name from the position
   */
  const _getEmployeeName = ({ position }: { position?: PositionEntity }) => {
    return (
      (position?.employees?.at(0)?.firstName ?? '') +
      ' ' +
      (position?.employees?.at(0)?.lastName ?? '')
    );
  };

  /**
   * Get filtered options based on active tab
   */
  const getFilteredOptions = () => {
    if (!positions) return [];

    return positions.map((position) => {
      const employee = position.employees?.at(0);
      if (activeTab === "Employee") {
        return {
          value: employee?.id ?? '',
          label: _getEmployeeName({ position }),
        };
      } else if (activeTab === "Role") {
        return {
          value: position.id,
          label: position.name,
        };
      } else if (activeTab === "Department") {
        return {
          value: position.department?.id ?? '',
          label: position.department?.name ?? '',
        };
      }
    }).filter(Boolean) as Option[];
  };

  /**
   * Show corresponding people based on tab
   */
  const _formatOptionLabel = ({ value }: Option) => {
    if (activeTab === "Employee") {
      const positionEntity = positions?.find((p) => p.employees?.some(e => e.id === value));
      return (
        <span>
          <strong>{_getEmployeeName({ position: positionEntity })}</strong>
        </span>
      );
    } else if (activeTab === "Role") {
      return (
        <span>
          <strong>{positions?.find((p) => p.id === value)?.name ?? ''}</strong>
        </span>
      );
    } else if (activeTab === "Department") {
      return (
        <span>
          <strong>{positions?.find((p) => p.department?.id === value)?.department?.name ?? 'No Department'}</strong>
        </span>
      );
    }
  };

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
        <Text font-size='16px' fontWeight='400' whiteSpace={"nowrap"}>Group {num}</Text>
      </Flex>
    );
  };

  const [border, background] = groupColors[index % groupColors.length];

  return (
    <Box w="100%">
      <Flex w="100%"  justifyContent="space-between" paddingBottom="6px">
        <Heading as="h3" color="black" marginTop='7px'>
          <GroupItem
            key={index}
            num={index + 1}
            color={background}
            border={border}
          />
        </Heading>
        <VStack align="start" spacing="8px">
          <HStack width="360px" spacing="0px" 
          borderWidth="1px" borderRadius="4px" overflow="hidden">
            {["Employee", "Role", "Department"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                flex="1"
                borderRadius="0"
                borderWidth="1px"
                backgroundColor={activeTab === tab ? "blue.50" : "white"}
                color={activeTab === tab ? "#1367EA" : '#63646B'}
                fontWeight={activeTab === tab ? "550" : '500'}
                _hover={{ backgroundColor: "blue.100" }}
              >
                {tab}
              </Button>
            ))}
          </HStack>
          <Box width='100%'>
            <Select
              useBasicStyles
              selectedOptionStyle="check"
              options={getFilteredOptions()}
              placeholder={assigneePlaceholderWithIcon}
              value={signaturePositions[index]}
              onChange={(selected) => {
                let updatedSignaturePositions = [...signaturePositions];
                updatedSignaturePositions[index] = selected;
                setSignaturePositions(updatedSignaturePositions);
                console.log("Updated signaturePositions:", updatedSignaturePositions);
              }}
              className="custom-dropdown"
              components={{
                DropdownIndicator: (props: any) => (
                  <chakraComponents.DropdownIndicator {...props}>
                    {isDropdownOpen ? <DropdownUpArrow maxH="7px" /> : <DropdownDownArrow maxH="7px" />}
                  </chakraComponents.DropdownIndicator>
                ),
              }}
              onMenuOpen={() => setIsDropdownOpen(true)}
              onMenuClose={() => setIsDropdownOpen(false)}
              formatOptionLabel={_formatOptionLabel}
              isClearable
              closeMenuOnSelect
            />
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
};
