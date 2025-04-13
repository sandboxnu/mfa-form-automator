import { Flex, Input, TableBody, TableHeader, TableRow } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react/box";
import { Heading, Text } from "@chakra-ui/react/typography";
import { InputGroup } from "@web/components/ui/input-group";
import { RightSearchIcon, UserProfileAvatar } from "@web/static/icons";

// TODO woo hard coded
const mockEmployees = [
    {
        firstName: 'Kai',
        lastName: 'Zheng',
        department: 'Sandbox',
        position: 'Project Lead',
        email: 'zheng.k@northeastern.edu',
    },
    {
        firstName: 'Elvin',
        lastName: 'Cheng',
        department: 'Sandbox',
        position: 'mother',
        email: 'cheng.e@northeastern.edu',
    },
    {
        firstName: 'Lauren',
        lastName: 'Brisette',
        department: 'Sandbox',
        position: 'Developer',
        email: 'brisette.l@northeastern.edu',
    },
]

export default function EmployeeDirectory() {
    const numEmployees = 100;

    return (
        // TODO header
        <>
            <Box p={8}>
                <Heading as="h1" fontSize="32px" fontWeight="500" mb={2}>
                    Employees
                </Heading>
                <Text color="gray.600" mb={6}>
                    {numEmployees.toLocaleString()} employees
                </Text>

                <Flex justify="space-between" align="center" mb={6}>
                    <InputGroup maxW="500px">
                        <Input
                            placeholder="Search Employees"
                            bg="white"
                            border="1px solid #E2E8F0"
                            borderRadius="6px"
                            fontSize="16px"
                        />
                    </InputGroup>
                </Flex>
            </Box>

        // TODO table of employees
            <Box bg="white" borderRadius="md" shadow="sm">
                {mockEmployees.map((employee, index) => {
                    return (
                        <Flex
                            key={index}
                            p={4}
                            align="center"
                            borderBottom="1px"
                            borderColor="gray.200"
                            _hover={{ bg: 'gray.50' }}
                        >
                            <Box flex={2}>
                                <Flex align="center" gap={3}>
                                    <UserProfileAvatar
                                        firstName={employee.firstName}
                                        lastName={employee.lastName}
                                    />
                                    <Text>{employee.firstName} {employee.lastName}</Text>
                                </Flex>
                            </Box>
                            <Box flex={1}>
                                <Text>{employee.department}</Text>
                            </Box>
                            <Box flex={1}>
                                <Text>{employee.email}</Text>
                            </Box>
                            <Box flex={1}>
                                <Text>{employee.email}</Text>
                            </Box>
                        </Flex>
                    )
                })}
            </Box>
        </>
    )
}