import { Flex, Box, Heading, Text, Input, Button } from '@chakra-ui/react';
import {
  DepartmentEntity,
  EmployeeBaseEntity,
  PositionBaseEntity,
  Scope,
  SortBy,
} from '@web/client';
import { DeleteEmployeeModal } from '@web/components/DeleteEmployeeModal';
import { ConfirmEmployeeChangesModal } from '@web/components/ConfirmEmployeeChangesModal';
import isAuth from '@web/components/isAuth';
import { SearchAndSort } from '@web/components/SearchAndSort';
import { useEmployeesContext } from '@web/context/EmployeesContext';
import { UserProfileAvatar } from '@web/static/icons';
import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import {
  departmentsControllerFindAll,
  positionsControllerFindAllInDepartment,
} from '@web/client';
import { EditDepartmentsModal } from '@web/components/editDepartment/EditDepartmentsModal';
import { EditPositionsModal } from '@web/components/editPosition/EditPositionsModal';

function EmployeeDirectory() {
  const [isDepartmentsModalOpen, setIsDepartmentsModalOpen] = useState(false);
  const [isPositionsModalOpen, setIsPositionsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // TODO sorting
  const [sortOption, setSortOption] = useState<SortBy>(SortBy.NAME_DESC);
  const { employees, isLoading, error } = useEmployeesContext();
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [positions, setPositions] = useState<PositionBaseEntity[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmChangesModalOpen, setIsConfirmChangesModalOpen] =
    useState(false);
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeBaseEntity | null>(null);
  const openModal = (employee: EmployeeBaseEntity) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentsControllerFindAll({
          query: { limit: 100 },
        });
        if (response.data) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      }
    };
    fetchDepartments();
  }, []);

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
        });
        if (response.data) {
          setPositions(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      }
    };
    fetchPositions();
  }, [selectedDepartment]);

  const handleEditClick = (employee: EmployeeBaseEntity) => {
    setEditingEmployee(employee.id);
    setEditedName(`${employee.firstName} ${employee.lastName}`);
    // @ts-ignore - position exists on employee but not in type
    setSelectedDepartment(employee.position?.department.id || '');
    // @ts-ignore - position exists on employee but not in type
    setSelectedPosition(employee.position?.id || '');
  };

  const handleSaveClick = () => {
    setIsConfirmChangesModalOpen(true);
  };

  const handleConfirmSave = () => {
    // TODO: Save changes
    setEditingEmployee(null);
    setIsConfirmChangesModalOpen(false);
  };

  // TODO: loading state, error handling, search functionality

  if (employees.length === 0) return null;
  return (
    <>
      <Box maxW="100%" p={8}>
        <Box>
          <Heading as="h1" fontSize="32px" fontWeight="500" mb={2}>
            Employees
          </Heading>
          <Text color="gray.600" mb={6}>
            {employees.length.toLocaleString()} employees
          </Text>

          <Flex justify="space-between" align="center" mb={6}>
            <SearchAndSort
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSortOption={setSortOption}
              placeholder="Search employees"
            />
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
            <Box flex={2}>
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
            <Box flex={1} />
          </Flex>
          {employees.map((employee, index) => {
            console.log(employee);
            return (
              // TODO height of row changes on edit click
              <Flex
                key={index}
                p={4}
                align="center"
                borderBottom="1px solid"
                borderColor="gray.200"
                _hover={{ bg: 'gray.50' }}
                role="group"
              >
                <Box flex={2}>
                  <Flex align="center" gap={3}>
                    <UserProfileAvatar
                      firstName={employee.firstName}
                      lastName={employee.lastName}
                    />
                    {editingEmployee === employee.id ? (
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        size="sm"
                        width="240px"
                      />
                    ) : (
                      <Text>
                        {employee.firstName} {employee.lastName}
                      </Text>
                    )}
                  </Flex>
                </Box>
                <Box flex={2}>
                  {editingEmployee === employee.id ? (
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      style={{
                        marginTop: '8px',
                        border: '1px solid #C0C0C0',
                        borderRadius: '6px',
                        padding: '10px',
                        width: '200px',
                        height: '40px',
                        fontSize: '14px',
                        color: '#2D3748',
                      }}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    // @ts-ignore - position exists on employee but not in type
                    <Text>{employee.position?.department.name}</Text>
                  )}
                </Box>
                <Box flex={2}>
                  {editingEmployee === employee.id ? (
                    <select
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      disabled={!selectedDepartment}
                      style={{
                        marginTop: '8px',
                        border: '1px solid #C0C0C0',
                        borderRadius: '6px',
                        padding: '10px',
                        width: '200px',
                        height: '40px',
                        fontSize: '14px',
                        color: '#2D3748',
                        opacity: selectedDepartment ? 1 : 0.5,
                      }}
                    >
                      <option value="">Select Position</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    // @ts-ignore - position exists on employee but not in type
                    <Text>{employee.position?.name}</Text>
                  )}
                </Box>
                <Box flex={2}>
                  <Text>{employee.email}</Text>
                </Box>
                <Box flex={1} as="button">
                  {/* TODO opacity on row hover */}
                  <Flex justify="flex-end" align="center" gap={2}>
                    {editingEmployee === employee.id ? (
                      <Flex gap={2}>
                        <Box
                          as="button"
                          p={2}
                          color="red.500"
                          _hover={{ color: 'red.600' }}
                          onClick={() => {
                            openModal(employee);
                          }}
                        >
                          <FiTrash2 size={20} />
                        </Box>
                        <Box
                          as="button"
                          bg="blue.500"
                          color="white"
                          px={4}
                          borderRadius="md"
                          _hover={{ bg: 'blue.600' }}
                          onClick={handleSaveClick}
                        >
                          Save
                        </Box>
                      </Flex>
                    ) : (
                      <Box
                        as="button"
                        onClick={() => handleEditClick(employee)}
                      >
                        <Flex align="center" gap={2}>
                          <FiEdit2 size={20} color="#4A5568" />
                          <Text>Edit</Text>
                        </Flex>
                      </Box>
                    )}
                  </Flex>
                </Box>
              </Flex>
            );
          })}
        </Box>
      </Box>
      {employeeToDelete && (
        <DeleteEmployeeModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          employee={employeeToDelete}
        />
      )}
      {editingEmployee && (
        <ConfirmEmployeeChangesModal
          isOpen={isConfirmChangesModalOpen}
          onClose={() => setIsConfirmChangesModalOpen(false)}
          onSave={handleConfirmSave}
          employee={employees.find((e) => e.id === editingEmployee)!}
          editedName={editedName}
          selectedDepartment={selectedDepartment}
          selectedPosition={selectedPosition}
          departments={departments}
          positions={positions}
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
