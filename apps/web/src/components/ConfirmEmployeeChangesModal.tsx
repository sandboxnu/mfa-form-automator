import { Dialog, Flex, Text, Button, Box, Portal } from '@chakra-ui/react';
import {
  PositionBaseEntity,
  DepartmentBaseEntity,
  EmployeeBaseEntityResponse,
  Scope,
} from '@web/client';
import { CloseIcon } from '@web/static/icons';

// Map of scope values to user-friendly display names
const ScopeDisplayNames = {
  [Scope.BASE_USER]: 'Base User',
  [Scope.CONTRIBUTOR]: 'Contributor',
  [Scope.ADMIN]: 'Administrator',
};

interface ConfirmEmployeeChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  employee: EmployeeBaseEntityResponse;
  editedFirstName: string;
  editedLastName: string;
  selectedNewDepartment: DepartmentBaseEntity | null;
  selectedNewPosition: PositionBaseEntity | null;
  selectedNewScope: Scope | null;
  isLoading: boolean;
}

/**
 * Modal that displays changes made to an employee and asks for confirmation before saving
 * @param isOpen - Whether the modal is open
 * @param onClose - Function to close the modal
 * @param onSave - Function to save the changes
 * @param employee - The employee being edited
 * @param editedFirstName - The new first name
 * @param editedLastName - The new last name
 * @param selectedNewDepartment - The new department
 * @param selectedNewPosition - The new position
 * @param selectedNewScope - The new scope
 * @returns A modal showing changes and confirmation buttons
 */
export const ConfirmEmployeeChangesModal = ({
  isOpen,
  onClose,
  onSave,
  employee,
  editedFirstName,
  editedLastName,
  selectedNewDepartment,
  selectedNewPosition,
  selectedNewScope,
  isLoading,
}: ConfirmEmployeeChangesModalProps) => {
  if (!employee) {
    setTimeout(() => onClose(), 0);
    return null;
  }

  const currentDepartment = employee.position?.department;
  const currentPosition = employee.position;
  const currentScope = (employee.scope as Scope) || Scope.BASE_USER;

  const hasNameChange =
    editedFirstName !== employee.firstName ||
    editedLastName !== employee.lastName;
  const hasDepartmentChange =
    currentDepartment?.id !== selectedNewDepartment?.id;
  const hasPositionChange = currentPosition?.id !== selectedNewPosition?.id;
  const hasScopeChange = currentScope !== selectedNewScope;
  const hasChanges =
    hasNameChange || hasDepartmentChange || hasPositionChange || hasScopeChange;

  // Get user-friendly scope display names
  const getScopeDisplayName = (scope: Scope) => {
    return ScopeDisplayNames[scope] || scope;
  };

  const oldFullName = `${employee.firstName} ${employee.lastName}`;
  const newFullName = `${editedFirstName} ${editedLastName}`;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      closeOnInteractOutside={true}
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.5)" />
        <Dialog.Positioner alignItems="center" justifyContent="center">
          <Dialog.Content
            padding="24px 32px"
            gap="24px"
            backgroundColor="#fff"
            flexDir="column"
            width="450px"
            borderRadius="8px"
            boxShadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
          >
            <Dialog.Header pb={0}>
              <Flex
                width="100%"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                position="relative"
              >
                <Dialog.Title
                  fontFamily="Hanken Grotesk"
                  fontSize="20px"
                  fontWeight="semibold"
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
                    top: 0,
                  }}
                />
              </Flex>
            </Dialog.Header>
            <Dialog.Body pt={4}>
              <Flex flexDirection="column" gap="10px">
                <Box>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="gray.600"
                    mb={1}
                  >
                    Name
                  </Text>
                  {hasNameChange ? (
                    <Flex align="center">
                      <Text fontWeight="medium">{oldFullName}</Text>
                      <Box mx={2} color="blue.500">
                        <Text fontSize="sm" fontWeight="bold">
                          ►
                        </Text>
                      </Box>
                      <Text fontWeight="medium">{newFullName}</Text>
                    </Flex>
                  ) : (
                    <Text fontWeight="medium">{oldFullName}</Text>
                  )}
                </Box>

                <Box>
                  {hasDepartmentChange && (
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.600"
                        mb={1}
                      >
                        Department
                      </Text>
                      <Flex align="center">
                        <Text fontWeight="medium">
                          {currentDepartment?.name || '—'}
                        </Text>
                        <Box mx={2} color="blue.500">
                          <Text fontSize="sm" fontWeight="bold">
                            ►
                          </Text>
                        </Box>
                        <Text fontWeight="medium">
                          {selectedNewDepartment?.name || '—'}
                        </Text>
                      </Flex>
                    </Box>
                  )}
                </Box>

                {hasPositionChange && (
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.600"
                      mb={1}
                    >
                      Position
                    </Text>
                    <Flex align="center">
                      <Text fontWeight="medium">
                        {currentPosition?.name || '—'}
                      </Text>
                      <Box mx={2} color="blue.500">
                        <Text fontSize="sm" fontWeight="bold">
                          ►
                        </Text>
                      </Box>
                      <Text fontWeight="medium">
                        {selectedNewPosition?.name || '—'}
                      </Text>
                    </Flex>
                  </Box>
                )}

                {/* Scope changes section */}
                {hasScopeChange && (
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.600"
                      mb={1}
                    >
                      Permission Scope
                    </Text>
                    <Flex align="center">
                      <Text fontWeight="medium">
                        {getScopeDisplayName(currentScope)}
                      </Text>
                      <Box mx={2} color="blue.500">
                        <Text fontSize="sm" fontWeight="bold">
                          ►
                        </Text>
                      </Box>
                      <Text fontWeight="medium">
                        {selectedNewScope
                          ? getScopeDisplayName(selectedNewScope)
                          : '—'}
                      </Text>
                    </Flex>
                  </Box>
                )}

                <Box mt={2}>
                  <Flex gap={4} justify="center" width="100%">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      width="120px"
                      height="38px"
                      fontSize="sm"
                      fontWeight="medium"
                      borderColor="#ced4da"
                      color="#333"
                      _hover={{ bg: 'gray.50' }}
                      borderRadius="4px"
                    >
                      Cancel
                    </Button>
                    <Button
                      bg="blue.500"
                      color="white"
                      _hover={{ bg: 'blue.600' }}
                      onClick={onSave}
                      width="120px"
                      height="38px"
                      fontSize="sm"
                      fontWeight="medium"
                      borderRadius="4px"
                      disabled={!hasChanges}
                      opacity={!hasChanges ? 0.6 : 1}
                      cursor={!hasChanges ? 'not-allowed' : 'pointer'}
                      loading={isLoading}
                    >
                      Save
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
