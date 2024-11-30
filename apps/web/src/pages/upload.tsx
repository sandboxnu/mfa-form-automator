import {
  Box,
  Button,
  Flex,
  MenuButton,
  Menu,
  Text,
  MenuItem,
  MenuList,
  Heading,
} from '@chakra-ui/react';
export default function Upload() {
  return (
    <Flex display={'inline'}>
      <Heading
        color="#2A2B2D"
        font-family="Hanken Grotesk"
        font-size="30px"
        font-style="normal"
        font-weight={700}
        line-height="38px"
      >
        Create form template
      </Heading>
      <Heading as="h3">Upload your form PDF</Heading>
    </Flex>
  );
}
