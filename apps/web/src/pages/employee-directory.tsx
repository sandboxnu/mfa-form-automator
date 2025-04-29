import { Flex } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react/box';
import { Heading, Text } from '@chakra-ui/react/typography';
import { EmployeeBaseEntity, Scope, SortBy } from '@web/client';
import { DeleteEmployeeModal } from '@web/components/DeleteEmployeeModal';
import isAuth from '@web/components/isAuth';
import { SearchAndSort } from '@web/components/SearchAndSort';
import { useEmployeesContext } from '@web/context/EmployeesContext';
import { UserProfileAvatar } from '@web/static/icons';
import { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

function EmployeeDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  // TODO sorting
  const [sortOption, setSortOption] = useState<SortBy>(SortBy.NAME_DESC);
  const { employees, isLoading, error } = useEmployeesContext();
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] =
    useState<EmployeeBaseEntity | null>(null);
  const openModal = (employee: EmployeeBaseEntity) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
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
                    <Text>
                      {employee.firstName} {employee.lastName}
                    </Text>
                  </Flex>
                </Box>
                <Box flex={2}>
                  <Text>{employee.position?.department.name}</Text>
                </Box>
                <Box flex={2}>
                  <Text>{employee.position?.name}</Text>
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
                          onClick={() => {
                            // TODO: Save changes
                            setEditingEmployee(null);
                          }}
                        >
                          Save
                        </Box>
                      </Flex>
                    ) : (
                      <Box
                        as="button"
                        onClick={() => setEditingEmployee(employee.id)}
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
    </>
  );
}

export default isAuth(EmployeeDirectory, [Scope.ADMIN]);
