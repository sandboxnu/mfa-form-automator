import { Box, Text, Select, Button, HStack, Heading } from '@chakra-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useState } from 'react';
import { Option } from './types';
import { SignatureDropdown } from './SignatureDropdown';
import { positionsControllerFindAllOptions } from '@web/client/@tanstack/react-query.gen';

export const AssignGroups = () => {
    const [signaturePositions, setSignaturePositions] = useState<
        (Option | null)[]
    >([]);
    const { formTemplate } = useCreateFormInstance();

    const { data: positions } = useQuery({
        ...positionsControllerFindAllOptions(),
    });

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
            <Box flex="1">
                <Heading as="h3" mb="28px">
                    Assignees
                </Heading>
                {formTemplate?.signatureFields.map((field, i) => (
                    <SignatureDropdown
                        key={field.id}
                        field={field}
                        index={i}
                        positions={positions}
                        signaturePositions={signaturePositions}
                        setSignaturePositions={setSignaturePositions}
                    />
                ))}
            </Box>
        </Box>
    );
};
