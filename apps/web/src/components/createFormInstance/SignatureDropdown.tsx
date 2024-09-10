import { Box, Heading } from '@chakra-ui/react';
import { DropdownDownArrow, DropdownUpArrow } from '@web/static/icons';
import { chakraComponents, Select } from 'chakra-react-select';
import { useState } from 'react';
import { PositionEntity, SignatureFieldEntity } from '@web/client';
import { Option } from './types';
import { SearchIcon } from '@web/static/icons';

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

  const getEmployeeName = ({ position }: { position?: PositionEntity }) => {
    return (
      (position?.employees?.at(0)?.firstName ?? '') +
      ' ' +
      (position?.employees?.at(0)?.lastName ?? '')
    );
  };

  const formatOptionLabel = ({ value, label }: Option) => {
    const positionEntity = positions?.find((position) => position.id === value);
    const employeeName = positionEntity?.name ?? '';

    return (
      <span>
        <strong>{getEmployeeName({ position: positionEntity })}</strong>
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
            employeeValue: employee?.id ?? '', // Ensure employeeValue is always a string
            label: fullLabel,
          };
        })}
        placeholder={assigneePlaceholderWithIcon}
        value={signaturePositions[index]} // Create a separate state for Department Head
        onChange={(selected) => {
          // value is the selected option or null
          let updatedSignaturePositions = signaturePositions.slice(0);
          updatedSignaturePositions[index] = selected;
          setSignaturePositions(updatedSignaturePositions);
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
        formatOptionLabel={formatOptionLabel}
        classNamePrefix="react-select"
        isClearable
        closeMenuOnSelect
      />
    </Box>
  );
};
