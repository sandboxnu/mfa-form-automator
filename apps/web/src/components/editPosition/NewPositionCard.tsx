import { Button, Flex, Input } from '@chakra-ui/react';
import { DepartmentEntityHydrated } from '@web/client';
import { RxCross2 } from 'react-icons/rx';

export const NewPositionCard = ({
  positionName,
  setPositionName,
  onCancel,
  onSave,
  isLoading,
  departments,
  setNewPositionDepartmentId,
}: {
  positionName: string;
  setPositionName: (name: string) => void;
  onCancel: () => void;
  onSave: () => void;
  isLoading: boolean;
  departments: DepartmentEntityHydrated[];
  setNewPositionDepartmentId: (id: string | null) => void;
}) => {
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
            setNewPositionDepartmentId(e.target.value);
          }}
          style={{
            marginTop: '8px',
            border: '1px solid #C0C0C0',
            borderRadius: '6px',
            paddingLeft: '8px',
            fontSize: '16px',
            width: '100%',
            height: '40px',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            color: '#000',
            backgroundImage: `url('/dropdown_arrow_down.svg')`,
            backgroundPosition: 'right 10px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '8px',
            paddingRight: '30px',
          }}
        >
          <option value="" disabled selected>
            Select your department
          </option>
          {departments?.map((department: DepartmentEntityHydrated) => (
            <option key={department.name} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </Flex>
      <Flex alignItems="center" gap="12px">
        <Button onClick={onCancel} variant="outline" border="1px solid #1367EA">
          <RxCross2 color="#1367EA" />
        </Button>
        <Button
          onClick={onSave}
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
          Create
        </Button>
      </Flex>
    </Flex>
  );
};
