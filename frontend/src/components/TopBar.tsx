import { MFALogoIcon, ProfileIcon, SearchIcon } from "@/static/icons";
import {
  Box,
  Hide,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";

export const TopBar: React.FC = () => {
  return (
    <Box padding={10} w="100vw" h="75">
      <HStack>
        <MFALogoIcon height="35" width="35" />
        <Spacer minW={200} />
        <InputGroup maxW="600">
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
          <InputRightElement
            pointerEvents="none"
            children={<SearchIcon boxSize="7" color="grey" />}
          />
          <Input
            placeholder="Search"
            borderTopLeftRadius="0"
            borderBottomLeftRadius="0"
          />
        </InputGroup>
        <Spacer />
        <Hide breakpoint="(max-width: 1000px)">
          <Text minW="200" align="right">
            Welcome back, User!
          </Text>
        </Hide>
        <IconButton
          aria-label="Visit profile"
          icon={<ProfileIcon boxSize={7} />}
          colorScheme="none"
        />
      </HStack>
    </Box>
  );
};
