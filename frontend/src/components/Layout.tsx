import {
  CompletedIcon,
  HistoryIcon,
  MFALogoIcon,
  OverViewIcon,
  PendingIcon,
  PlusIcon,
  ProfileIcon,
  SearchIcon,
  SettingsIcon,
  ToDoIcon,
} from "@/static/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Hide,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Component } from "react";
import { NavBar } from "./NavBar";
import { TopBar } from "./TopBar";

// Common layout component for all pages

export const Layout = ({ children }: { children: any }) => {
  const icons = {
    overview: <OverViewIcon marginRight="2" />,
    todo: <ToDoIcon marginRight="2" />,
    pending: <PendingIcon marginRight="2" />,
    completed: <CompletedIcon marginRight="2" />,
    history: <HistoryIcon marginRight="2" />,
    settings: <SettingsIcon marginRight="2" />,
  };

  const NavItem = (props) => {
    const { icon, children, ...rest } = props;
    return (
      <Box px="8">
        <Flex
          align="center"
          px="4"
          pl="4"
          py="3"
          rounded="8px"
          cursor="pointer"
          color="inherit"
          _dark={{
            color: "gray.400",
          }}
          _hover={{
            bg: "#FFDCCC",
            color: "gray.900",
          }}
          role="group"
          fontWeight="semibold"
          transition=".15s ease"
          {...rest}
        >
          {icons[icon as keyof typeof icons]}
          {children}
        </Flex>
      </Box>
    );
  };

  const SidebarContent = (props) => (
    <Box
      as="nav"
      pos="fixed"
      top="136"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: "gray.800",
      }}
      border
      color="inherit"
      borderRightWidth="1px"
      w="80"
      {...props}
    >
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="black"
        aria-label="Main Navigation"
      >
        <Flex
          align="center"
          px="4"
          pl="8"
          py="3"
          cursor="pointer"
          color="inherit"
          _dark={{
            color: "gray.400",
          }}
          role="group"
          fontWeight="semibold"
          transition=".15s ease"
        >
          <Button
            marginY="5"
            // marginBottom="5"
            height="40px"
            width="156px"
            justifyContent="center"
            bg="#D74100"
            textColor="white"
            textAlign="center"
            fontSize="sm"
            _hover={{
              bg: "gray.100",
              _dark: {
                bg: "gray.900",
              },
              color: "gray.900",
            }}
          >
            <PlusIcon marginRight={11} />
            Create Form
          </Button>
        </Flex>
        <NavItem icon="overview">Overview</NavItem>
        <NavItem icon="todo">To do</NavItem>
        <NavItem icon="pending">Pending</NavItem>
        <NavItem icon="completed">Completed</NavItem>
        <Box px={8}>
          <Divider mt={"5"} mb={5} borderColor={"gray"} />
        </Box>
        <NavItem icon="history">History</NavItem>
        <NavItem icon="settings">Settings</NavItem>
        <Spacer minH="30vh" />
      </Flex>
    </Box>
  );

  return (
    <Box
      as="section"
      bg="gray.50"
      _dark={{
        bg: "gray.700",
      }}
      minH="100vh"
    >
      <SidebarContent />
      <Box>
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
        >
          <Box minWidth={302}>
            <Flex px="4" py="5" align="left">
              <MFALogoIcon height="35" width="35" />
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
              placeholder="Search for articles..."
            />
            <InputRightElement
              pointerEvents="none"
              children={<SearchIcon boxSize="7" color="grey" />}
            />
          </InputGroup>

          <Flex align="center" pl="10">
            <Hide breakpoint="(max-width: 1000px)">
              <Text minW="200" align="right">
                Welcome back, User!
              </Text>
            </Hide>
            <IconButton
              pl="5"
              aria-label="Visit profile"
              icon={<ProfileIcon boxSize={7} />}
              colorScheme="none"
            />
          </Flex>
        </Flex>

        <Box as="main" ml="320" pt="136">
          {/* Add content here, remove div below  */}
          <Box borderWidth="4px" borderStyle="dashed" rounded="md" minH="500" />
        </Box>
      </Box>
    </Box>
  );
};
