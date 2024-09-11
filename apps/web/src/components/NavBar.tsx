import {
  Box,
  Button,
  Flex,
  Divider,
  Spacer,
  MenuButton,
  Menu,
  Text,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import {
  OverViewIcon,
  ToDoIcon,
  PendingIcon,
  CompletedIcon,
  HistoryIcon,
  SettingsIcon,
  PlusIcon,
  FormInstanceIcon,
} from 'apps/web/src/static/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const icons = {
  overview: <OverViewIcon marginRight="2" />,
  todo: <ToDoIcon marginRight="2" />,
  pending: <PendingIcon marginRight="2" />,
  completed: <CompletedIcon marginRight="2" />,
  history: <HistoryIcon marginRight="2" />,
  settings: <SettingsIcon marginRight="2" />,
  formInstance: <FormInstanceIcon marginRight="2" />,
};

/**
 * @param children - the children of the nav item
 * @param icon - the icon of the nav item
 * @param link - the link of the nav item
 * @returns a nav item for the left sidebar
 */
const NavItem = ({
  children,
  icon,
  link,
}: {
  children: any;
  icon: string;
  link: string;
}) => {
  const router = useRouter();
  const isActive = router.pathname === link;

  return (
    <Link href={link}>
      <Box px="12">
        <Flex
          align="center"
          px="4"
          pl="4"
          py="2"
          rounded="8px"
          cursor="pointer"
          _dark={{
            color: 'gray.400',
          }}
          _hover={{
            bg: '#EFEFEF !important',
            color: 'gray.900',
          }}
          style={{
            fontWeight: isActive ? '800' : 'normal',
            color: isActive ? '#263345' : 'inherit',
          }}
          bg={isActive ? '#EFEFEF' : 'white'}
          role="group"
          transition=".15s ease"
        >
          {icons[icon as keyof typeof icons]}
          <Text
            textColor={isActive ? '#263345 !important' : ''}
            fontWeight={isActive ? 'bold !important' : 'inherit'}
            className="p1"
          >
            {children}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
};

/**
 * @param onOpenCreateFormTemplate - the function to open the create form template modal
 * @param onOpenCreateFormInstance - the function to open the create form instance modal
 * @returns  the nav bar for the left sidebar
 */
export const NavBar = ({
  onOpenCreateFormTemplate,
  onOpenCreateFormInstance,
  ...props
}: {
  onOpenCreateFormTemplate: () => void;
  onOpenCreateFormInstance: () => void;
  props?: {};
}) => {
  return (
    <Box
      as="nav"
      pos="fixed"
      top="96px"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      _dark={{
        bg: 'gray.800',
      }}
      border="true"
      color="inherit"
      borderRightWidth="1px"
      width="80"
      {...props}
    >
      <Flex
        align="center"
        px="4"
        pt="40px"
        pb="32px"
        pl="12"
        rounded="8px"
        cursor="pointer"
        color="inherit"
        _dark={{
          color: 'gray.400',
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
      >
        <Menu closeOnSelect={false}>
          <MenuButton
            as={Button}
            h="40px"
            w="124px"
            backgroundColor="#4C658A"
            textColor="white"
            leftIcon={<PlusIcon />}
          >
            Create
          </MenuButton>
          <MenuList minW="0px" w={'124px'} p="5px">
            {/* add form instance prop in the menu item below when ready */}
            <MenuItem rounded="8px" onClick={onOpenCreateFormInstance}>
              Form
            </MenuItem>
            <MenuItem rounded="8px" onClick={onOpenCreateFormTemplate}>
              Template
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <NavItem icon="overview" link="/">
        Overview
      </NavItem>
      <NavItem icon="todo" link="/todo">
        To do
      </NavItem>
      <NavItem icon="pending" link="/pending">
        Pending
      </NavItem>
      <NavItem icon="completed" link="/completed">
        Completed
      </NavItem>
      <Box px={12}>
        <Divider mt={'5'} mb={5} borderColor={'gray'} />
      </Box>
      <NavItem icon="history" link="/history">
        History
      </NavItem>
      <NavItem icon="settings" link="/settings">
        Settings
      </NavItem>
      <Box
        paddingLeft="40px"
        fontSize="14px"
        position="absolute"
        bottom="130px"
      >
        Museum of Fine Arts, Boston
      </Box>
      <Spacer minH="30vh" />
    </Box>
  );
};
