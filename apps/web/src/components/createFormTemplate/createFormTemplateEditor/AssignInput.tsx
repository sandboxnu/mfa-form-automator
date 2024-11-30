import { Box, Text } from '@chakra-ui/react';
import { FormEditor } from './FormEditor';

export const AssignInput = () => {
  return (
    <Box margin="36px" display="flex" flexDirection="column" gap="20px">
      <Box>
        <Text fontSize="30px" fontWeight="700" lineHeight="38px">
          Create form template
        </Text>
        <Text
          fontSize="19px"
          color="#4B4C4F"
          fontFamily="Hanken Grotesk"
          fontWeight="500"
          lineHeight="26px"
          wordBreak="break-word"
        >
          Select an assignee group and drag to add input fields for each
        </Text>
      </Box>
      <FormEditor pdfUrl={'http://localhost:3002/test.pdf'} />
    </Box>
  );
};
