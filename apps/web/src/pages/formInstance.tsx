import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const FormInstance = () => {
  return (
    <Box className="main">
      <Flex align="center" p={4}>
        <IconButton
          aria-label="Back to Pending"
          icon={<ArrowBackIcon />}
          mr={2}
          bg="transparent"
          onClick={() => {
            // handle the click action here
          }}
        />
        <Text
          color="#000"
          fontFamily="Hanken Grotesk"
          fontSize="27px"
          fontStyle="normal"
          fontWeight="800"
          lineHeight="normal"
          textAlign="center"
          flex={1}
        >
          Travel Authorization Form
        </Text>
      </Flex>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="20px"
        fontStyle="normal"
        fontWeight="600"
        lineHeight="normal"
        textAlign="center"
        my={4}
      >
        Description
      </Text>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="16px"
        fontStyle="normal"
        fontWeight="normal"
        lineHeight="normal"
        textAlign="center"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et imperdiet enim. Ut enim justo, tincidunt ac enim ut, mollis pulvinar neque. Suspendisse id semper nunc.
      </Text>
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="20px"
        fontStyle="normal"
        fontWeight="600"
        lineHeight="normal"
        textAlign="center"
        my={4}
      >
        From Preview
      </Text>
      <Box
        w="436.353px"
        h="566.219px"
        bg="#000"
        mx="auto"
        my={4}
      />
      <Text
        color="#000"
        fontFamily="Hanken Grotesk"
        fontSize="20px"
        fontStyle="normal"
        fontWeight="600"
        lineHeight="normal"
        textAlign="center"
        my={4}
      >
        Assignees
      </Text>
      {/* Your content here */}
    </Box>
  );
};

export default FormInstance;
