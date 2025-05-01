import {
  Flex,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Spinner,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { EmployeeBaseEntityResponse, Scope, SortBy } from '@web/client';
import { ConfirmEmployeeChangesModal } from '@web/components/ConfirmEmployeeChangesModal';
import { DeleteConfirmModal } from '@web/components/DeleteConfirmModal';
import isAuth from '@web/components/isAuth';
import { SearchAndSort } from '@web/components/SearchAndSort';
import { PlusIcon, UserProfileAvatar } from '@web/static/icons';
import { useState, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryClient } from '@web/pages/_app';
import { EditDepartmentsModal } from '@web/components/editDepartment/EditDepartmentsModal';
import { EditPositionsModal } from '@web/components/editPosition/EditPositionsModal';
import { useAuth } from '@web/hooks/useAuth';
import { Toaster, toaster } from '@web/components/ui/toaster';
import {
  employeesControllerFindAllQueryKey,
  employeesControllerFindAllOptions,
  employeesControllerRemoveMutation,
  departmentsControllerFindAllOptions,
  positionsControllerFindAllInDepartmentOptions,
  employeesControllerUpdateMutation,
  employeesControllerCreateMutation,
} from '@web/client/@tanstack/react-query.gen';

// Enhanced Scope enum with user-friendly display names
const ScopeDisplayNames = {
  [Scope.BASE_USER]: 'Base User',
  [Scope.CONTRIBUTOR]: 'Contributor',
  [Scope.ADMIN]: 'Administrator',
};

// Grid template columns for the table - evenly spaced
const gridTemplateColumns = '25% 15% 15% 15% 20% 10%';

/**
 * Employee Directory page that displays all employees with their details
 * and provides functionality to edit, filter, and remove employees.
 * @returns The employee directory UI with searchable/sortable list of employees
 */
function EmployeeDirectory() {
  const [isDepartmentsModalOpen, setIsDepartmentsModalOpen] = useState(false);
  const [isPositionsModalOpen, setIsPositionsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortBy>(SortBy.CREATED_AT_DESC);

  const { data: { employees = [] } = {} } = useQuery({
    ...employeesControllerFindAllOptions({
      query: {
        secure: true,
        sortBy: sortOption,
      },
    }),
  });

  const { data: departments = [] } = useQuery({
    ...departmentsControllerFindAllOptions(),
  });

  const [filteredEmployees, setFilteredEmployees] = useState<
    EmployeeBaseEntityResponse[]
  >([]);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedScope, setSelectedScope] = useState<Scope>(Scope.BASE_USER);
  const [originalData, setOriginalData] = useState<{
    firstName: string;
    lastName: string;
    departmentId: string;
    positionId: string;
    scope: Scope;
  } | null>(null);
  const { user, refreshUser } = useAuth();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isConfirmChangesModalOpen, setIsConfirmChangesModalOpen] =
    useState(false);
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeBaseEntityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<string | null>(null);

  // New employee creation states
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDepartment, setNewDepartment] = useState<string>('');
  const [newPosition, setNewPosition] = useState<string>('');
  const [newScope, setNewScope] = useState<Scope>(Scope.BASE_USER);
  const [isCreationLoading, setIsCreationLoading] = useState(false);

  const { data: positions } = useQuery({
    ...positionsControllerFindAllInDepartmentOptions({
      path: {
        departmentId: selectedDepartment || '',
      },
    }),
    enabled: !!selectedDepartment,
  });

  const { data: newPositions } = useQuery({
    ...positionsControllerFindAllInDepartmentOptions({
      path: {
        departmentId: newDepartment || '',
      },
    }),
    enabled: !!newDepartment,
  });

  const createEmployee = useMutation({
    ...employeesControllerCreateMutation(),
    onMutate: () => {
      setIsCreationLoading(true);
    },
    onError: (error) => {
      setIsCreationLoading(false);
      toaster.create({
        title: 'Error',
        description: `Failed to create employee: ${
          error.message || 'Please try again.'
        }`,
        type: 'error',
        duration: 5000,
      });
    },
    onSuccess: () => {
      setIsCreationLoading(false);
      setIsCreatingEmployee(false);
      resetNewEmployeeForm();

      // Refresh the employee list to ensure it's up to date
      queryClient.invalidateQueries({
        queryKey: employeesControllerFindAllQueryKey(),
      });
      refreshUser();

      toaster.create({
        title: 'Success',
        description: 'Employee created successfully',
        type: 'success',
        duration: 5000,
      });
    },
  });

  const updateEmployee = useMutation({
    ...employeesControllerUpdateMutation(),
    onMutate: () => {
      setIsLoading(true);
    },
    onError: (error) => {
      setIsLoading(false);
      toaster.create({
        title: 'Error',
        description: `Failed to update employee: ${
          error.message || 'Please try again.'
        }`,
        type: 'error',
        duration: 5000,
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      setEditingEmployee(null);
      setIsConfirmChangesModalOpen(false);

      // Refresh the employee list to ensure it's up to date
      queryClient.invalidateQueries({
        queryKey: employeesControllerFindAllQueryKey(),
      });
      refreshUser();

      toaster.create({
        title: 'Success',
        description: 'Employee updated successfully',
        type: 'success',
        duration: 5000,
      });
    },
  });

  useEffect(() => {
    if (!employees) return;

    if (searchQuery.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = employees.filter((employee) => {
        const fullName =
          `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const departmentName =
          employee.position?.department?.name?.toLowerCase() || '';
        const positionName = employee.position?.name?.toLowerCase() || '';
        const email = employee.email?.toLowerCase() || '';
        const scope = employee.scope?.toLowerCase() || '';

        return (
          fullName.includes(query) ||
          departmentName.includes(query) ||
          positionName.includes(query) ||
          email.includes(query) ||
          scope.includes(query)
        );
      });
      setFilteredEmployees(filtered);
    }
  }, [employees, searchQuery]);

  const deactivateEmployee = useMutation({
    ...employeesControllerRemoveMutation(),
    onMutate: () => {
      setIsLoading(true);
    },
    onError: () => {
      setIsLoading(false);

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
      setIsLoading(false);
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
   * Toggles the create employee form
   */
  const toggleCreateEmployeeForm = () => {
    setIsCreatingEmployee(!isCreatingEmployee);
    if (!isCreatingEmployee) {
      resetNewEmployeeForm();
    }
  };

  /**
   * Resets the new employee form to its initial state
   */
  const resetNewEmployeeForm = () => {
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewDepartment('');
    setNewPosition('');
    setNewScope(Scope.BASE_USER);
  };

  /**
   * Handles creating a new employee
   */
  const handleCreateEmployee = () => {
    if (!newFirstName || !newLastName || !newEmail) {
      toaster.create({
        title: 'Error',
        description: 'First name, last name, and email are required.',
        type: 'error',
        duration: 5000,
      });
      return;
    }

    createEmployee.mutate({
      body: {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        positionId: newPosition || undefined,
        scope: newScope,
        accessToken: '123456', // doesn't really matter here
      },
    });
  };

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
      deactivateEmployee.mutate({
        path: { id: employeeId },
      });
    }
  };

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
    const scope = (employee.scope as Scope) || Scope.BASE_USER;

    setOriginalData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      departmentId,
      positionId,
      scope,
    });

    setSelectedDepartment(departmentId);
    setSelectedPosition(positionId);
    setSelectedScope(scope);
  };

  /**
   * Opens the confirm changes modal when save button is clicked
   */
  const handleSaveClick = () => {
    setIsConfirmChangesModalOpen(true);
  };

  /*
   * Handles updating the employee after confirmation
   */
  const handleConfirmSave = async () => {
    if (!editingEmployee || !originalData) return;

    updateEmployee.mutateAsync({
      path: { id: editingEmployee },
      body: {
        firstName: editedFirstName,
        lastName: editedLastName,
        positionId: selectedPosition || undefined,
        scope: selectedScope,
      },
    });
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
      selectedPosition !== originalData.positionId ||
      selectedScope !== originalData.scope
    );
  };

  // Get user-friendly scope display names
  const getScopeDisplayName = (scope: Scope) => {
    return ScopeDisplayNames[scope] || scope;
  };

  // Get all available scopes as an array for display
  const scopeEntries = Object.entries(Scope).map(([key, value]) => ({
    key,
    value,
    displayName: ScopeDisplayNames[value] || value,
  }));

  if (filteredEmployees.length === 0 && !isCreatingEmployee) return null;

  return (
    <>
      <Toaster />
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
              <Button
                variant="outline"
                ml="4"
                padding="4px 12px"
                bg="#1367EA"
                color="white"
                borderRadius="6px"
                onClick={toggleCreateEmployeeForm}
              >
                <PlusIcon
                  boxSize="14px"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.38"
                  mr="2"
                />
                {isCreatingEmployee ? 'Cancel' : 'Create Employee'}
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
          {/* Table Header */}
          <Grid
            templateColumns={gridTemplateColumns}
            p={4}
            borderBottom="1px solid"
            borderColor="gray.200"
            color="gray.700"
            fontWeight="500"
          >
            <GridItem>
              <Text fontWeight="600">Name</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="600">Department</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="600">Position</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="600">Scope</Text>
            </GridItem>
            <GridItem>
              <Text fontWeight="600">Email</Text>
            </GridItem>
            <GridItem textAlign="right">
              <Text fontWeight="600">Actions</Text>
            </GridItem>
          </Grid>

          {/* Create new employee row */}
          {isCreatingEmployee && (
            <Grid
              templateColumns={gridTemplateColumns}
              p={4}
              alignItems="center"
              borderBottom="1px solid"
              borderColor="gray.200"
              bg="blue.50"
            >
              {/* Name with avatar */}
              <GridItem>
                <Flex gap={2} width="100%">
                  <Input
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
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
                    autoFocus
                  />
                  <Input
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
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
              </GridItem>

              {/* Department */}
              <GridItem>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  style={{
                    marginTop: '0px',
                    border: '1px solid #C0C0C0',
                    borderRadius: '6px',
                    paddingLeft: '8px',
                    fontSize: '16px',
                    width: '100%',
                    maxWidth: '200px',
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
              </GridItem>

              {/* Position */}
              <GridItem>
                <select
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  disabled={!newDepartment}
                  style={{
                    marginTop: '0px',
                    border: '1px solid #C0C0C0',
                    borderRadius: '6px',
                    paddingLeft: '8px',
                    fontSize: '16px',
                    width: '100%',
                    maxWidth: '200px',
                    height: '40px',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    color: newDepartment ? '#000' : '#6C757D',
                    opacity: newDepartment ? 1 : 0.5,
                    backgroundImage: `url('/dropdown_arrow_down.svg')`,
                    backgroundPosition: 'right 10px center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '8px',
                    paddingRight: '30px',
                  }}
                >
                  {!newDepartment ? (
                    <option disabled value="">
                      Select a department first
                    </option>
                  ) : newPositions && newPositions.length > 0 ? (
                    <>
                      <option value="" disabled>
                        Select Position
                      </option>
                      {newPositions.map((pos) => (
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
              </GridItem>

              {/* Scope */}
              <GridItem>
                <select
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value as Scope)}
                  style={{
                    marginTop: '0px',
                    border: '1px solid #C0C0C0',
                    borderRadius: '6px',
                    paddingLeft: '8px',
                    fontSize: '16px',
                    width: '100%',
                    maxWidth: '200px',
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
                  {Object.values(Scope).map((scope) => (
                    <option key={scope} value={scope}>
                      {getScopeDisplayName(scope)}
                    </option>
                  ))}
                </select>
              </GridItem>

              {/* Email */}
              <GridItem>
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  size="md"
                  width="100%"
                  placeholder="Email"
                  borderColor="gray.300"
                  paddingLeft="12px"
                  _hover={{ borderColor: 'gray.400' }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px #3182ce',
                  }}
                />
              </GridItem>

              {/* Actions */}
              <GridItem textAlign="right">
                <Flex justify="flex-end" align="center" gap={2}>
                  <Box
                    as="button"
                    bg="green.500"
                    color="white"
                    px={3}
                    py={1.5}
                    fontSize="sm"
                    borderRadius="md"
                    _hover={{ bg: 'green.600' }}
                    onClick={handleCreateEmployee}
                    cursor="pointer"
                  >
                    {isCreationLoading ? (
                      <Flex align="center" gap={1}>
                        <Spinner size="sm" color="white" mr={1} />
                        <Text>Creating...</Text>
                      </Flex>
                    ) : (
                      'Create'
                    )}
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
                    onClick={toggleCreateEmployeeForm}
                    cursor="pointer"
                  >
                    Cancel
                  </Box>
                </Flex>
              </GridItem>
            </Grid>
          )}

          {/* Employee rows */}
          {filteredEmployees.map((employee, index) => (
            <Grid
              key={index}
              templateColumns={gridTemplateColumns}
              p={4}
              alignItems="center"
              borderBottom="1px solid"
              borderColor="gray.200"
              _hover={{ bg: 'gray.50' }}
              className="employee-row"
              position="relative"
              onMouseEnter={() => setHoveredRowIndex(employee.id)}
              onMouseLeave={() => setHoveredRowIndex(null)}
            >
              {/* Name with avatar */}
              <GridItem>
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
              </GridItem>

              {/* Department */}
              <GridItem>
                {editingEmployee === employee.id ? (
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    style={{
                      marginTop: '0px',
                      border: '1px solid #C0C0C0',
                      borderRadius: '6px',
                      paddingLeft: '8px',
                      fontSize: '16px',
                      width: '100%',
                      maxWidth: '200px',
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
              </GridItem>

              {/* Position */}
              <GridItem>
                {editingEmployee === employee.id ? (
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    disabled={!selectedDepartment}
                    style={{
                      marginTop: '0px',
                      border: '1px solid #C0C0C0',
                      borderRadius: '6px',
                      paddingLeft: '8px',
                      fontSize: '16px',
                      width: '100%',
                      maxWidth: '200px',
                      height: '40px',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      color: selectedDepartment ? '#000' : '#6C757D',
                      opacity: selectedDepartment ? 1 : 0.5,
                      backgroundImage: `url('/dropdown_arrow_down.svg')`,
                      backgroundPosition: 'right 10px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '8px',
                      paddingRight: '30px',
                    }}
                  >
                    {!selectedDepartment ? (
                      <option disabled value="">
                        Select a department first
                      </option>
                    ) : positions && positions.length > 0 ? (
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
              </GridItem>

              {/* Scope */}
              <GridItem>
                {editingEmployee === employee.id ? (
                  <select
                    value={selectedScope}
                    onChange={(e) => setSelectedScope(e.target.value as Scope)}
                    style={{
                      marginTop: '0px',
                      border: '1px solid #C0C0C0',
                      borderRadius: '6px',
                      paddingLeft: '8px',
                      fontSize: '16px',
                      width: '100%',
                      maxWidth: '200px',
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
                    {Object.values(Scope).map((scope) => (
                      <option key={scope} value={scope}>
                        {getScopeDisplayName(scope)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Text>
                    {getScopeDisplayName(employee.scope as Scope) || '—'}
                  </Text>
                )}
              </GridItem>

              {/* Email */}
              <GridItem>
                <Text>{employee.email || '—'}</Text>
              </GridItem>

              {/* Actions */}
              <GridItem textAlign="right">
                <Flex justify="flex-end" align="center" gap={2}>
                  {editingEmployee === employee.id ? (
                    <Flex gap={2}>
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
                          setSelectedScope(
                            (employee.scope as Scope) || Scope.BASE_USER,
                          );
                        }}
                        cursor="pointer"
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
                        cursor="pointer"
                      >
                        <Flex align="center" gap={1}>
                          <Text>Delete</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  ) : (
                    <Box
                      as="button"
                      onClick={() => handleEditClick(employee)}
                      display={
                        hoveredRowIndex === employee.id ? 'block' : 'none'
                      }
                      cursor="pointer"
                    >
                      <Flex align="center" gap={2}>
                        <FiEdit2 size={16} color="#4A5568" />
                        <Text fontSize="sm">Edit</Text>
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </GridItem>
            </Grid>
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
          isLoading={isLoading}
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
            positions?.find((p) => p.id === selectedPosition) || null
          }
          selectedNewScope={selectedScope}
          isLoading={isLoading}
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
