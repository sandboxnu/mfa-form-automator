import {
  Flex,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Badge,
} from '@chakra-ui/react';
import {
  DepartmentEntity,
  EmployeeBaseEntityResponse,
  PositionBaseEntity,
  Scope,
  SortBy,
} from '@web/client';
import { ConfirmEmployeeChangesModal } from '@web/components/ConfirmEmployeeChangesModal';
import { DeleteConfirmModal } from '@web/components/DeleteConfirmModal';
import isAuth from '@web/components/isAuth';
import { SearchAndSort } from '@web/components/SearchAndSort';
import { UserProfileAvatar } from '@web/static/icons';
import { useState, useEffect, useMemo } from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import {
  departmentsControllerFindAll,
  positionsControllerFindAllInDepartment,
  employeesControllerUpdate,
  employeesControllerRemove,
} from '@web/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { EditDepartmentsModal } from '@web/components/editDepartment/EditDepartmentsModal';
import { EditPositionsModal } from '@web/components/editPosition/EditPositionsModal';
import { useAuth } from '@web/hooks/useAuth';
import { client } from '@web/client/client.gen';
import { Toaster, toaster } from '@web/components/ui/toaster';
import {
  employeesControllerFindAllQueryKey,
  employeesControllerFindAllOptions,
} from '@web/client/@tanstack/react-query.gen';

/**
 * Employee Directory page that displays all employees with their details
 * and provides functionality to edit, filter, and remove employees.
 * @returns The employee directory UI with searchable/sortable list of employees
 */
function EmployeeDirectory() {
  const [isDepartmentsModalOpen, setIsDepartmentsModalOpen] = useState(false);
  const [isPositionsModalOpen, setIsPositionsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortBy>(SortBy.NAME_DESC);

  const { data: { employees = [] } = {} } = useQuery({
    ...employeesControllerFindAllOptions({
      query: {
        secure: true,
        sortBy: sortOption,
      },
    }),
  });

  const [filteredEmployees, setFilteredEmployees] = useState<
    EmployeeBaseEntityResponse[]
  >([]);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [positions, setPositions] = useState<PositionBaseEntity[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [originalData, setOriginalData] = useState<{
    firstName: string;
    lastName: string;
    departmentId: string;
    positionId: string;
  } | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isConfirmChangesModalOpen, setIsConfirmChangesModalOpen] =
    useState(false);
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeBaseEntityResponse | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const styles = `
    .employee-row:hover .edit-button {
      display: block !important;
    }
  `;

  useEffect(() => {
    if (!employees) return;

    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
      const query = searchQuery.toLowerCase().trim();
      const filtered = employees.filter((employee) => {
        const fullName =
          `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const departmentName =
          employee.position?.department?.name?.toLowerCase() || '';
        const positionName = employee.position?.name?.toLowerCase() || '';
        const email = employee.email.toLowerCase();

        return (
          fullName.includes(query) ||
          departmentName.includes(query) ||
          positionName.includes(query) ||
          email.includes(query)
        );
      });
      setFilteredEmployees(filtered);
    }
  }, [employees, searchQuery]);

  /**
   * Mutation to handle deactivating an employee
   * Calls the API to deactivate the employee instead of storing IDs in localStorage
   */
  const deactivateEmployee = useMutation({
    mutationFn: async (employeeId: string) => {
      // Call the API to deactivate the employee
      const response = await employeesControllerRemove({
        path: { id: employeeId },
        client,
      });
      return { success: true, id: employeeId };
    },
    onMutate: (employeeId) => {
      setIsDeleteLoading(true);
      if (editingEmployee === employeeId) {
        setEditingEmployee(null);
        setIsConfirmChangesModalOpen(false);
      }
      setFilteredEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== employeeId),
      );
    },
    onError: (error: any, employeeId) => {
      console.error('Failed to deactivate employee:', error);
      setIsDeleteLoading(false);

      // Refresh the employee list on error to restore the employee that failed to deactivate
      queryClient.invalidateQueries({
        queryKey: employeesControllerFindAllQueryKey(),
      });

      toaster.create({
        title: 'Error',
        description: 'Failed to deactivate employee. Please try again.',
        type: 'error',
        duration: 5000,
      });

      setIsDeleteConfirmOpen(false);
    },
    onSuccess: () => {
      setIsDeleteLoading(false);
      setIsDeleteConfirmOpen(false);

      // Refresh the employee list to ensure it's up to date
      queryClient.invalidateQueries({
        queryKey: employeesControllerFindAllQueryKey(),
      });

      toaster.create({
        title: 'Success',
        description: 'Employee deactivated successfully',
        type: 'success',
        duration: 5000,
      });
    },
  });

  /**
   * Opens the delete confirmation modal for an employee
   * @param employee - The employee to be deleted
   */
  const openDeleteModal = (employee: EmployeeBaseEntityResponse) => {
    if (employee.id === user?.id) {
      toaster.create({
        title: 'Cannot deactivate',
        description: 'You cannot deactivate your own account',
        type: 'error',
        duration: 5000,
      });
      return;
    }

    setEmployeeToDelete(employee);
    setIsDeleteConfirmOpen(true);
  };

  /**
   * Handles the confirmation of employee deactivation
   */
  const handleDeactivateEmployee = async () => {
    if (employeeToDelete) {
      const employeeId = employeeToDelete.id;
      if (editingEmployee === employeeId) {
        setEditingEmployee(null);
      }
      deactivateEmployee.mutate(employeeId);
    }
  };

  // Fetch departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentsControllerFindAll({
          query: { limit: 100 },
          client,
        });
        if (response.data) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        toaster.create({
          title: 'Error',
          description: 'Failed to fetch departments',
          type: 'error',
          duration: 5000,
        });
      }
    };
    fetchDepartments();
  }, []);

  // Fetch positions when selected department changes
  useEffect(() => {
    const fetchPositions = async () => {
      if (!selectedDepartment) {
        setPositions([]);
        return;
      }
      try {
        const response = await positionsControllerFindAllInDepartment({
          path: { departmentId: selectedDepartment },
          query: { limit: 100 },
          client,
        });
        if (response.data) {
          setPositions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch positions:', error);
        toaster.create({
          title: 'Error',
          description: 'Failed to fetch positions',
          type: 'error',
          duration: 5000,
        });
      }
    };
    fetchPositions();
  }, [selectedDepartment]);

  /**
   * Sets up the form for editing an employee
   * @param employee - The employee to be edited
   */
  const handleEditClick = (employee: EmployeeBaseEntityResponse) => {
    setEditingEmployee(employee.id);
    setEditedFirstName(employee.firstName);
    setEditedLastName(employee.lastName);

    const departmentId = employee.position?.department?.id || '';
    const positionId = employee.position?.id || '';

    setOriginalData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      departmentId,
      positionId,
    });

    setSelectedDepartment(departmentId);
    setSelectedPosition(positionId);

    if (departmentId) {
      fetchPositionsForDepartment(departmentId);
    }
  };

  /**
   * Fetches positions for a specific department
   * @param departmentId - The ID of the department to fetch positions for
   */
  const fetchPositionsForDepartment = async (departmentId: string) => {
    try {
      const response = await positionsControllerFindAllInDepartment({
        path: { departmentId },
        query: { limit: 100 },
        client,
      });
      if (response.data) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch positions:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to fetch positions',
        type: 'error',
        duration: 5000,
      });
    }
  };

  /**
   * Opens the confirm changes modal when save button is clicked
   */
  const handleSaveClick = () => {
    setIsConfirmChangesModalOpen(true);
  };

  /**
   * Handles saving the edited employee information after confirmation
   */
  const handleConfirmSave = async () => {
    const employeeIndex = filteredEmployees.findIndex(
      (e) => e.id === editingEmployee,
    );

    if (employeeIndex !== -1) {
      try {
        await employeesControllerUpdate({
          path: { id: editingEmployee || '' },
          body: {
            firstName: editedFirstName,
            lastName: editedLastName,
            positionId: selectedPosition || undefined,
          },
          client,
        });

        const updatedEmployees = [...filteredEmployees];
        const selectedPositionObj = positions.find(
          (p) => p.id === selectedPosition,
        );
        const selectedDepartmentObj = departments.find(
          (d) => d.id === selectedDepartment,
        );

        updatedEmployees[employeeIndex] = {
          ...updatedEmployees[employeeIndex],
          firstName: editedFirstName,
          lastName: editedLastName,
          position: selectedPositionObj
            ? {
                ...selectedPositionObj,
                department: selectedDepartmentObj || null,
              }
            : updatedEmployees[employeeIndex].position,
        };

        setFilteredEmployees(updatedEmployees);
        queryClient.invalidateQueries({
          queryKey: employeesControllerFindAllQueryKey(),
        });

        toaster.create({
          title: 'Success',
          description: 'Employee updated successfully',
          type: 'success',
          duration: 5000,
        });
      } catch (error) {
        console.error('Failed to update employee:', error);
        toaster.create({
          title: 'Error',
          description: 'Failed to update employee. Please try again.',
          type: 'error',
          duration: 5000,
        });
      }
    }

    setEditingEmployee(null);
    setIsConfirmChangesModalOpen(false);
  };

  /**
   * Checks if any changes have been made to the employee being edited
   * @returns True if changes have been made, false otherwise
   */
  const hasChanges = () => {
    if (!originalData || !editingEmployee) return false;

    return (
      editedFirstName !== originalData.firstName ||
      editedLastName !== originalData.lastName ||
      selectedDepartment !== originalData.departmentId ||
      selectedPosition !== originalData.positionId
    );
  };

  if (filteredEmployees.length === 0) return null;

  return (
    <>
      <Toaster />
      <style>{styles}</style>
      <Box maxW="100%" p={8}>
        <Box>
          <Heading as="h1" fontSize="32px" fontWeight="500" mb={2}>
            Employees
          </Heading>
          <Text color="gray.600" mb={6}>
            {filteredEmployees.length.toLocaleString()} employees
          </Text>

          <Flex justify="space-between" align="center" mb={6}>
            <SearchAndSort
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSortOption={setSortOption}
              placeholder="Search employees"
            />
            <Flex>
              <Button
                ml={4}
                px={4}
                variant="outline"
                bg="#FFF"
                borderRadius="4px"
                border="1px solid #E5E5E5"
                onClick={() => setIsPositionsModalOpen(true)}
              >
                Manage positions
              </Button>
              <Button
                ml={4}
                px={4}
                variant="outline"
                bg="#FFF"
                borderRadius="4px"
                border="1px solid #E5E5E5"
                onClick={() => setIsDepartmentsModalOpen(true)}
              >
                Manage departments
              </Button>
            </Flex>
          </Flex>
        </Box>

        <Box
          bg="white"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex
            p={4}
            borderBottom="1px solid"
            borderColor="gray.200"
            color="gray.700"
            fontWeight="500"
          >
            <Box flex={3}>
              <Flex align="center">
                <Text fontWeight="600">Name</Text>
              </Flex>
            </Box>
            <Box flex={2}>
              <Flex align="center">
                <Text fontWeight="600">Department</Text>
              </Flex>
            </Box>
            <Box flex={2}>
              <Flex align="center">
                <Text fontWeight="600">Position</Text>
              </Flex>
            </Box>
            <Box flex={2}>
              <Flex align="center">
                <Text fontWeight="600">Email</Text>
              </Flex>
            </Box>
            <Box flex={2} />
          </Flex>

          {/* Employee rows */}
          {filteredEmployees.map((employee, index) => (
            <Flex
              key={index}
              p={4}
              align="center"
              borderBottom="1px solid"
              borderColor="gray.200"
              _hover={{ bg: 'gray.50' }}
              className="employee-row"
              position="relative"
            >
              {/* Name with avatar */}
              <Box flex={3}>
                <Flex align="center" gap={3}>
                  <UserProfileAvatar
                    firstName={employee.firstName}
                    lastName={employee.lastName}
                  />
                  {editingEmployee === employee.id ? (
                    <Flex gap={2} width="100%">
                      <Input
                        value={editedFirstName}
                        onChange={(e) => setEditedFirstName(e.target.value)}
                        size="md"
                        width="45%"
                        placeholder="First name"
                        borderColor="gray.300"
                        paddingLeft="12px"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px #3182ce',
                        }}
                      />
                      <Input
                        value={editedLastName}
                        onChange={(e) => setEditedLastName(e.target.value)}
                        size="md"
                        width="45%"
                        placeholder="Last name"
                        borderColor="gray.300"
                        paddingLeft="12px"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{
                          borderColor: 'blue.500',
                          boxShadow: '0 0 0 1px #3182ce',
                        }}
                      />
                    </Flex>
                  ) : (
                    <Text>
                      {employee.firstName} {employee.lastName}
                    </Text>
                  )}
                </Flex>
              </Box>

              {/* Department */}
              <Box flex={2}>
                {editingEmployee === employee.id ? (
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 1rem',
                      width: '80%',
                      maxWidth: '200px',
                      fontSize: '1rem',
                      height: '2.5rem',
                      outline: 'none',
                      color: '#2D3748',
                      appearance: 'none',
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232D3748'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em 1.5em',
                    }}
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    {departments.length > 0 ? (
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No departments available</option>
                    )}
                  </select>
                ) : (
                  <Text>{employee.position?.department?.name || '—'}</Text>
                )}
              </Box>

              {/* Position */}
              <Box flex={2}>
                {editingEmployee === employee.id ? (
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    disabled={!selectedDepartment}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 1rem',
                      width: '80%',
                      maxWidth: '200px',
                      fontSize: '1rem',
                      height: '2.5rem',
                      outline: 'none',
                      color: '#2D3748',
                      opacity: selectedDepartment ? 1 : 0.5,
                      appearance: 'none',
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232D3748'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5em 1.5em',
                    }}
                  >
                    {!selectedDepartment ? (
                      <option disabled value="">
                        Select a department first
                      </option>
                    ) : positions.length > 0 ? (
                      <>
                        <option value="" disabled>
                          Select Position
                        </option>
                        {positions.map((pos) => (
                          <option key={pos.id} value={pos.id}>
                            {pos.name}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option disabled value="">
                        No positions for this department
                      </option>
                    )}
                  </select>
                ) : (
                  <Text>{employee.position?.name || '—'}</Text>
                )}
              </Box>

              {/* Email */}
              <Box flex={2}>
                <Text>{employee.email || '—'}</Text>
              </Box>

              {/* Actions */}
              <Box flex={2} display="flex" justifyContent="flex-end">
                <Flex justify="flex-end" align="center" gap={2}>
                  {editingEmployee === employee.id ? (
                    <Flex gap={2} width="100%">
                      <Box
                        as="button"
                        bg={hasChanges() ? 'blue.500' : 'blue.300'}
                        color="white"
                        px={3}
                        py={1.5}
                        fontSize="sm"
                        borderRadius="md"
                        _hover={{
                          bg: hasChanges() ? 'blue.600' : 'blue.300',
                        }}
                        onClick={hasChanges() ? handleSaveClick : undefined}
                        opacity={hasChanges() ? 1 : 0.7}
                        cursor="pointer"
                      >
                        Save
                      </Box>
                      <Box
                        as="button"
                        px={3}
                        py={1.5}
                        fontSize="sm"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.300"
                        _hover={{ bg: 'gray.100' }}
                        onClick={() => {
                          setEditingEmployee(null);
                          setEditedFirstName(employee.firstName);
                          setEditedLastName(employee.lastName);
                          setSelectedDepartment(
                            employee.position?.department?.id || '',
                          );
                          setSelectedPosition(employee.position?.id || '');
                        }}
                      >
                        Cancel
                      </Box>
                      <Box
                        as="button"
                        onClick={() => openDeleteModal(employee)}
                        px={3}
                        py={1.5}
                        fontSize="sm"
                        color="red.500"
                        borderRadius="md"
                        _hover={{ bg: 'red.50' }}
                      >
                        <Flex align="center" gap={1}>
                          <FiTrash2 size={16} />
                          <Text>Delete</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  ) : (
                    <Box
                      as="button"
                      onClick={() => handleEditClick(employee)}
                      display="none"
                      className="edit-button"
                    >
                      <Flex align="center" gap={2}>
                        <FiEdit2 size={16} color="#4A5568" />
                        <Text fontSize="sm">Edit</Text>
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </Box>
            </Flex>
          ))}
        </Box>
      </Box>

      {employeeToDelete && (
        <DeleteConfirmModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleDeactivateEmployee}
          deleteObjectType="Employee"
          deleteObjectName={`${employeeToDelete.firstName} ${employeeToDelete.lastName}`}
          isLoading={isDeleteLoading}
          actionText="Remove"
          title="Remove Employee"
          description={`Are you sure you want to remove ${employeeToDelete.firstName} ${employeeToDelete.lastName} from the directory?`}
        />
      )}
      {editingEmployee && (
        <ConfirmEmployeeChangesModal
          isOpen={isConfirmChangesModalOpen}
          onClose={() => setIsConfirmChangesModalOpen(false)}
          onSave={handleConfirmSave}
          employee={filteredEmployees.find((e) => e.id === editingEmployee)!}
          editedFirstName={editedFirstName}
          editedLastName={editedLastName}
          selectedNewDepartment={
            departments.find((d) => d.id === selectedDepartment) || null
          }
          selectedNewPosition={
            positions.find((p) => p.id === selectedPosition) || null
          }
        />
      )}
      <EditDepartmentsModal
        isOpen={isDepartmentsModalOpen}
        onClose={() => setIsDepartmentsModalOpen(false)}
      />
      <EditPositionsModal
        isOpen={isPositionsModalOpen}
        onClose={() => setIsPositionsModalOpen(false)}
      />
    </>
  );
}

export default isAuth(EmployeeDirectory, [Scope.ADMIN]);
