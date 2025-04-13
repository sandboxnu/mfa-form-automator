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
    {
        firstName: 'Bryan',
        lastName: 'Baboolal',
        department: 'Sandbox',
        position: 'Developer',
        email: 'baboolal.b@northeastern.edu',
    },
    {
        firstName: 'Donny',
        lastName: 'Le',
        department: 'Sandbox',
        position: 'Developer',
        email: 'le.d@northeastern.edu',
    },
    {
        firstName: 'Gabi',
        lastName: 'Schwarz',
        department: 'Sandbox',
        position: 'Designer',
        email: 'schwarz.g@northeastern.edu',
    },
    {
        firstName: 'Kevin',
        lastName: 'Eng',
        department: 'Sandbox',
        position: 'Designer',
        email: 'eng.k@northeastern.edu',
    },
    {
        firstName: 'Gayatri',
        lastName: 'Kondabathini',
        department: 'Sandbox',
        position: 'Developer',
        email: 'kondabathini.g@northeastern.edu',
    },
    {
        firstName: 'Angela',
        lastName: 'Weigl',
        department: 'Sandbox',
        position: 'Developer',
        email: 'weigl.a@northeastern.edu',
    },
]

export default function EmployeeDirectory() {
    const numEmployees = 9;

    return (
        // TODO 
        <Box maxW="100%" p={8}>
            <Box>
                <Heading as="h1" fontSize="32px" fontWeight="500" mb={2}>
                    Employees
                </Heading>
                <Text color="gray.600" mb={6}>
                    {numEmployees.toLocaleString()} employees
                </Text>

                <Flex justify="space-between" align="center" mb={6}>
                    <InputGroup maxW="800px">
                        <Input
                            px={4}
                            placeholder="Search Employees"
                            border="2px solid #E2E8F0"
                            borderRadius="6px"
                            fontSize="16px"
                        >
                            {/* <RightSearchIcon /> */}
                        </Input>
                    </InputGroup>
                </Flex>
            </Box>

            <Box bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
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
                        <Flex align="center" >
                            <Text fontWeight="600">Department</Text>
                        </Flex>
                    </Box>
                    <Box flex={2}>
                        <Flex align="center" >
                            <Text fontWeight="600">Position</Text>
                        </Flex>
                    </Box>
                    <Box flex={2}>
                        <Flex align="center" >
                            <Text fontWeight="600">Email</Text>
                        </Flex>
                    </Box>
                </Flex>
                {mockEmployees.map((employee, index) => {
                    return (
                        <Flex
                            key={index}
                            p={4}
                            align="center"
                            borderBottom="1px solid"
                            borderColor="gray.200"
                            _hover={{ bg: 'gray.50' }}
                        >
                            <Box flex={1}>
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
        </Box>
    )
}