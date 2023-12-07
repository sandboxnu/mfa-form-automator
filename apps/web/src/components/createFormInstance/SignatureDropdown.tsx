import { Box, Text } from '@chakra-ui/react';
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

  const formatOptionLabel = ({ value, label }: Option) => (
    <span>
      <strong>
        {getEmployeeName({
          position: positions?.find((position) => position.id === value),
        })}
      </strong>
      <span style={{ marginLeft: '8px', color: 'gray' }}>{label}</span>
    </span>
  );

  return (
    <Box w="100%">
      <Text fontWeight="500" fontSize="16px" color="black" marginTop="40px">
        {field.name}
      </Text>
      <Select
        useBasicStyles
        selectedOptionStyle="check"
        options={positions?.map((position) => {
          return {
            value: position.id,
            label: position.name,
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
              {isDropdownOpen ? <DropdownUpArrow /> : <DropdownDownArrow />}
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
