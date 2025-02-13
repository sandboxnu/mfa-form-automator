import { Box, Text, Select, Button, HStack } from '@chakra-ui/react';
import { useState } from 'react';

export const AssignGroups = () => {
  const [groups, setGroups] = useState([
    { id: 1, name: 'Group 1', type: 'Employee', assignee: '' },
    { id: 2, name: 'Group 2', type: 'Employee', assignee: '' },
    { id: 3, name: 'Group 3', type: 'Employee', assignee: '' },
  ]);

  const handleAssigneeChange = (id: number, value: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === id ? { ...group, assignee: value } : group
      )
    );
  };

  return (
    <Box margin="36px" display="flex" flexDirection="column" gap="20px">
      <Box>
        <Text fontSize="30px" fontWeight="700" lineHeight="38px">
          Create form instance
        </Text>
        <Text fontSize="19px" color="#4B4C4F" fontWeight="500" lineHeight="26px">
          Assign your input field groups to a person, role, or department
        </Text>
      </Box>
      <Box>
        {groups.map((group) => (
          <HStack key={group.id} padding="10px" border="1px solid #ccc" borderRadius="8px">
            <Text fontWeight="600">{group.name}</Text>
            <Select
              placeholder="Select assignee"
              value={group.assignee}
              onChange={(e) => handleAssigneeChange(group.id, e.target.value)}
            >
              <option value="User 1">User 1</option>
              <option value="User 2">User 2</option>
              <option value="User 3">User 3</option>
            </Select>
          </HStack>
        ))}
      </Box>
    </Box>
  );
};
