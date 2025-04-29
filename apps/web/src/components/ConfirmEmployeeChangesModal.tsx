import { Dialog, Flex, Portal, Text, Button } from '@chakra-ui/react';
import {
  DepartmentEntity,
  EmployeeBaseEntity,
  PositionBaseEntity,
} from '@web/client';
import { CloseIcon } from '@web/static/icons';

interface ConfirmEmployeeChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  employee: EmployeeBaseEntity;
  editedName: string;
  selectedDepartment: string;
  selectedPosition: string;
  departments: DepartmentEntity[];
  positions: PositionBaseEntity[];
}

export const ConfirmEmployeeChangesModal = ({
  isOpen,
  onClose,
  onSave,
  employee,
  editedName,
  selectedDepartment,
  selectedPosition,
  departments,
  positions,
}: ConfirmEmployeeChangesModalProps) => {
  // @ts-ignore - position exists on employee but not in type
  const currentDepartment = employee.position?.department;
  // @ts-ignore - position exists on employee but not in type
  const currentPosition = employee.position;
  const newDepartment = departments.find((d) => d.id === selectedDepartment);
  const newPosition = positions.find((p) => p.id === selectedPosition);

  const hasNameChange =
    editedName !== `${employee.firstName} ${employee.lastName}`;
  const hasDepartmentChange = currentDepartment?.id !== selectedDepartment;
  const hasPositionChange = currentPosition?.id !== selectedPosition;

  return (
    // TODO vibe coded this, lowkey it works!
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      closeOnInteractOutside={true}
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
        <Dialog.Positioner alignItems="center" justifyContent={'center'}>
          <Dialog.Content
            padding={'24px 32px'}
            gap="24px"
            backgroundColor="#F8F9FA"
            flexDir={'column'}
            width="559px"
            borderRadius="12px"
            boxShadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
          >
            <Dialog.Header>
              <Flex
                width="100%"
                flexDirection="row"
                justifyContent={'center'}
                alignItems={'center'}
                position="relative"
              >
                <Dialog.Title
                  fontFamily={'Hanken Grotesk'}
                  fontSize="19px"
                  fontWeight="bold"
                  lineHeight="26px"
                  textAlign="center"
                >
                  Confirm Changes
                </Dialog.Title>
                <CloseIcon
                  onClick={onClose}
                  cursor="pointer"
                  style={{
                    width: '19px',
                    height: '19px',
                    position: 'absolute',
                    right: 0,
                  }}
                />
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Flex flexDirection="column" alignItems="center" gap="24px">
                {hasNameChange && (
                  <Flex width="100%" justify="space-between" align="center">
                    <Text color="gray.600">
                      Current: {employee.firstName} {employee.lastName}
                    </Text>
                    <Text color="blue.500">New: {editedName}</Text>
                  </Flex>
                )}
                {hasDepartmentChange && (
                  <Flex width="100%" justify="space-between" align="center">
                    <Text color="gray.600">
                      Current: {currentDepartment?.name}
                    </Text>
                    <Text color="blue.500">New: {newDepartment?.name}</Text>
                  </Flex>
                )}
                {hasPositionChange && (
                  <Flex width="100%" justify="space-between" align="center">
                    <Text color="gray.600">
                      Current: {currentPosition?.name}
                    </Text>
                    <Text color="blue.500">New: {newPosition?.name}</Text>
                  </Flex>
                )}
                <Flex gap={4} justify="center" width="100%">
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    onClick={onClose}
                    width="120px"
                    borderColor="blue.500"
                    color="blue.500"
                    _hover={{ bg: 'blue.50' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="blue.500"
                    color="white"
                    _hover={{ bg: 'blue.600' }}
                    onClick={onSave}
                    width="120px"
                  >
                    Save
                  </Button>
                </Flex>
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
