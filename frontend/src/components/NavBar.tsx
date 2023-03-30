import {
  Box,
  Button,
  Flex,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  Link,
} from "@chakra-ui/react";
import {
  OverViewIcon,
  ToDoIcon,
  PendingIcon,
  CompletedIcon,
  HistoryIcon,
  SettingsIcon,
  PlusIcon,
} from "@/static/icons";
import { useRouter } from "next/router";

// button abstraction to include the Link and styling
const StyleButton = ({ children, link }: { children: any; link: string }) => {
  const router = useRouter();
  const isActive = router.pathname === link;
  return (
    <>
      <Link href={link} width="100%">
        <Button
          justifyContent="flex-start"
          bg="transparent"
          height="44px"
          width="240px"
          borderRadius={10}
          // temporary until I figure out custom color schemes
          style={{
            background: isActive ? "#FAFA78" : "white",
          }}
          _hover={{
            background: "#EFEFEF !important",
          }}
          isActive={isActive}
        >
          {children}
        </Button>
      </Link>
    </>
  );
};

// Navbar component
export const NavBar: React.FC = () => {
  return (
    <Box padding={10} w={320} h="100vh">
      <Flex
        alignItems="flex-start"
        justify="space-around"
        flexDirection="column"
      >
        <Popover>
          <PopoverTrigger>
            <Button
              marginBottom="5"
              height="48px"
              width="183px"
              justifyContent="center"
              bg="#FF5000"
              textColor="white"
              textAlign="center"
            >
              <PlusIcon marginRight={11} />
              Create Form
            </Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent w="350px">
              <PopoverArrow />
              <PopoverHeader>Select Form</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Button marginRight="2">Form #1</Button>
                <Button marginRight="2">Form #2</Button>
                <Button marginRight="2">Form #3</Button>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
        <Box>
          <StyleButton link="/">
            <OverViewIcon marginRight="2" />
            Overview
          </StyleButton>
          <StyleButton link="/todo">
            <ToDoIcon marginRight="2" />
            To do
          </StyleButton>
          <StyleButton link="/pending">
            <PendingIcon marginRight="2" />
            Pending
          </StyleButton>
          <StyleButton link="/completed">
            <CompletedIcon marginRight="2" />
            Completed
          </StyleButton>
          <Divider mt={"5"} mb={5} borderColor={"gray"} />
          <StyleButton link="/history">
            <HistoryIcon marginRight="2" />
            History
          </StyleButton>
          <StyleButton link="/settings">
            <SettingsIcon marginRight="2" />
            Settings
          </StyleButton>
        </Box>
        <Box position="absolute" bottom="0" fontSize={16} paddingBottom={5}>
          Museum of Fine Arts, Boston
        </Box>
      </Flex>
    </Box>
  );
};
