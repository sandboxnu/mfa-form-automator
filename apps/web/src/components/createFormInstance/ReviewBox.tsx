import { Box, Text, Flex, useQuery } from '@chakra-ui/react';
import { FormView } from './FormView';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { positionsControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';
import { getNameFromAssignedGroup } from '@web/utils/formInstanceUtils';
import { AssignedGroupEntity, employeesControllerFindOne, EmployeesControllerFindOneData } from '@web/client';

export const ReviewBox = ({
    formLink,
    name,
    description,
}: {
    formLink: string;
    name: string;
    description: string;
}) => {
    const textInputStyle = {
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        borderRadius: '4px',
        border: '1px solid #E5E5E5',
        outlineColor: 'transparent',
        borderColor: 'transparent',
    };

    const { assignedGroupData } = useCreateFormInstance();
    
    const getEmployeeData = async (employeeId: string) => {
        const options = {
            path: {
              id: employeeId,  // Provide the ID of the employee you're looking for
            },
            url: '/api/employees/{id}',  // Ensure this matches the API's expected URL
          };
      
        try {
          const response = await employeesControllerFindOne(options);
          console.log('Employee Data:', response);
        } catch (error) {
          console.error(error);
        }
      };
    



    const groupColors = [
        ['#1367EA', '#EEF5FF'],
        ['#BD21CA', '#FDEAFF'],
        ['#7645E8', '#ECE4FF'],
        ['#567E26', '#EDFFD6'],
        ['#A16308', '#FFFDDB'],
    ];

    const GroupItem = ({
        color,
        border,
    }: {
        color: string;
        border: string;
    }) => {
        return (
            <Flex gap="10px" alignItems="center">
                <Box
                    width="24px"
                    height="24px"
                    backgroundColor={color}
                    border={`1px solid ${border}`}
                />
            </Flex>
        );
    };

    return (
        <Flex
            flexDirection={'row'}
            gap={'40px'}
            alignContent={'justify'}
            alignSelf="stretch"
            width="100%"
        >
            <Flex
                flexDirection="column"
                gap="24px"
                width="480px"
                alignItems={'flex-start'}
            >
                <Flex gap="8px" flexDirection="column" width="480px">
                    <Text fontWeight={600}>Name</Text>
                    <Text {...textInputStyle}>{name}</Text>
                </Flex>
                <Flex gap="8px" flexDirection="column" width="480px">
                    <Text fontWeight={600}>Description</Text>
                    <Text {...textInputStyle}>{description}</Text>
                </Flex>

                <Flex flexDirection={'column'} gap="12px">
                    <Flex gap="12px" flexDirection="column" width="480px">
                        <Text fontWeight={600}>Assigned Field Groups</Text>
                    </Flex>
                    {assignedGroupData.map((group, i) => {
                        const [border, background] = groupColors[i % groupColors.length];
                        return (
                            <Flex key={i} align="center" mr={4}>
                                <GroupItem
                                    color={background}
                                    border={border}
                                />
                                <Text ml={2}>{group ? group.positionId : null}</Text>
                            </Flex>

                        );
                    })}
                </Flex>
            </Flex>
            <Flex
                flexDirection={'column'}
                gap="8px"
                alignItems="flex-start"
                flex="1 0 0"
            >
                <Text
                    color="#7C7F86"
                    fontSize="14px"
                    fontWeight="500px"
                    lineHeight="21px"
                >
                    Preview Only
                </Text>
                <FormView
                    formTemplateName={name}
                    pdfUrl={formLink}
                />
            </Flex>
        </Flex>
    );
};
