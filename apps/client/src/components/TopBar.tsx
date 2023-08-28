import {
  MFALogoIcon,
  ProfileIcon,
  SearchIcon,
} from "apps/client/src/static/icons";
import {
  Box,
  Hide,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Flex,
} from "@chakra-ui/react";

export const TopBar: React.FC = () => {
  return (
    <Flex
      as="header"
      align="center"
      pos="fixed"
      w="full"
      px="4"
      bg="white"
      _dark={{
        bg: "gray.800",
      }}
      borderBottomWidth="1px"
      color="inherit"
      h="136"
      zIndex="sticky"
    >
      <Box minWidth={302}>
        <Flex px="4" py="5" align="left">
          <MFALogoIcon height="51px" width="220px" />
        </Flex>
      </Box>
      <InputGroup
        display={{
          md: "flex",
        }}
      >
        <Select
          minW="120"
          maxW="120"
          backgroundColor="lightgrey"
          borderTopRightRadius="0"
          borderBottomRightRadius="0"
        >
          <option value="all_forms">All Forms</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
        <Input
          borderTopLeftRadius="0"
          borderBottomLeftRadius="0"
          placeholder="Search all forms"
        />
        <InputRightElement pointerEvents="none">
          <SearchIcon boxSize="7" color="grey" />
        </InputRightElement>
      </InputGroup>

      <Flex align="center" pl="10">
        <Hide breakpoint="(max-width: 1000px)">
          <Text minW="200" align="right">
            Welcome back, User!
          </Text>
        </Hide>
        <IconButton
          pl="12px"
          pr="40px"
          aria-label="Visit profile"
          icon={<ProfileIcon boxSize={7} />}
          colorScheme="none"
        />
      </Flex>
    </Flex>
  );
};
