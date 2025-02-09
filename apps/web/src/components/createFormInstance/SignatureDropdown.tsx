import { Box, Heading } from '@chakra-ui/react';
import { DropdownDownArrow, DropdownUpArrow } from '@web/static/icons';
import { chakraComponents, Select } from 'chakra-react-select';
import { useState } from 'react';
import { AssignedGroupData, PositionOption } from './types';
import { SearchIcon } from '@web/static/icons';
import { FieldGroupBaseEntity, PositionEntity } from '@web/client';

const assigneePlaceholderWithIcon = (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <SearchIcon pl="5px" boxSize="24px" />
    <span style={{ marginLeft: '8px' }}>Select assignee</span>
  </div>
);

/**
 * @param field - the signature field
 * @param index - the index of the signature field
 * @param positions - the positions to choose from
 * @param signaturePositions - the signature positions
 * @param setSignaturePositions - function to set the signature positions
 * @returns a dropdown to select the assignee for the signature field
 */
export const SignatureDropdown = ({
  field,
  index,
  positions,
  assignedGroupData,
  setAssignedGroupData,
}: {
  field: FieldGroupBaseEntity;
  index: number;
  positions?: PositionEntity[];
  assignedGroupData: AssignedGroupData[];
  setAssignedGroupData: (updatedAssignedGroupData: AssignedGroupData[]) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<PositionOption | null>();

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
   * Format the option label
   */
  const _formatOptionLabel = ({ value }: PositionOption) => {
    const positionEntity = positions?.find((position) => position.id === value);
    const employeeName = positionEntity?.name ?? '';

    return (
      <span>
        <strong>{_getEmployeeName({ position: positionEntity })}</strong>
        <span style={{ marginLeft: '8px', color: 'gray' }}>{employeeName}</span>
      </span>
    );
  };

  return (
    <Box w="100%">
      <Heading as="h3" color="black" marginTop="40px" paddingBottom="6px">
        {field.name}
      </Heading>
      <Select
        useBasicStyles
        selectedOptionStyle="check"
        options={positions?.map((position) => {
          const employee = position.employees?.at(0);
          const fullName =
            employee?.firstName ?? '' + ' ' + employee?.lastName ?? '';
          const fullLabel = fullName + ' ' + position.name;
          return {
            value: position.id,
            label: fullLabel,
          };
        })}
        placeholder={assigneePlaceholderWithIcon}
        value={selectedPosition} // Create a separate state for Department Head
        onChange={(selected: PositionOption | null) => {
          setSelectedPosition(selected);
          // TODO: probably should not be coercing this type
          let selectedAssignedGroupData = assignedGroupData?.at(index)!;
          selectedAssignedGroupData.positionId = selected?.value;
          assignedGroupData[index] = {
            ...selectedAssignedGroupData,
            fieldGroupId: selectedAssignedGroupData?.fieldGroupId,
            positionId: selected?.value,
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
        formatOptionLabel={_formatOptionLabel}
        classNamePrefix="react-select"
        isClearable
        closeMenuOnSelect
      />
    </Box>
  );
};
