import {
  Box,
  Button,
  Flex,
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
  PlusIcon,
  FormInstanceIcon,
  GrayPencilIcon,
} from 'apps/web/src/static/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const icons = {
  overview: <OverViewIcon marginRight="2" />,
  overviewActive: <OverViewIcon marginRight="2" />,
  todo: <ToDoIcon marginRight="2" />,
  todoActive: <ToDoIcon marginRight="2" />,
  pending: <PendingIcon marginRight="2" />,
  pendingActive: <PendingIcon marginRight="2" />,
  completed: <CompletedIcon marginRight="2" />,
  completedActive: <CompletedIcon marginRight="2" />,
  formInstance: <FormInstanceIcon marginRight="2" />,
  test: <GrayPencilIcon marginRight="2" />,
  testActive: <GrayPencilIcon marginRight="2" />,
};
type IconKeys = keyof typeof icons;
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
  const iconKey = isActive ? `${icon}Active` : icon;

  return (
    <Link href={link}>
      <Box
        px="12"
        _hover={{
          bg: '#EFEFEF !important',
          color: '#0C0C0C',
        }}
        bg={isActive ? '#EFEFEF' : 'white'}
        transition=".15s ease"
      >
        <Flex
          align="center"
          px="4"
          pl="4"
          py="2"
          cursor="pointer"
          _dark={{
            color: 'gray.400',
          }}
          style={{
            fontWeight: isActive ? '800' : 'normal',
            color: isActive ? '#263345' : 'inherit',
          }}
          role="group"
        >
          {icons[iconKey as IconKeys]}
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
 * @param onOpenCreateFormInstance - the function to open the create form instance modal
 * @returns  the nav bar for the left sidebar
 */
export const NavBar = ({
  onOpenCreateFormInstance,
  ...props
}: {
  onOpenCreateFormInstance: () => void;
  props?: {};
}) => {
  const router = useRouter();
  return (
    <Box
      as="nav"
      pos="fixed"
      top="64px"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      boxShadow="1px 0px 4px #E5E5E5"
      bg="#FEFEFE"
      _dark={{
        bg: 'gray.800',
      }}
      border="true"
      color="inherit"
      borderRightWidth="1px"
      width="224"
      {...props}
    >
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
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
            backgroundColor="#1367EA"
            textColor="white"
            leftIcon={<PlusIcon />}
          >
            Create
          </MenuButton>
          <MenuButton padding="8px 22px 8px 16px"></MenuButton>
          <MenuList>
            <MenuItem rounded="8px" onClick={onOpenCreateFormInstance}>
              Form
            </MenuItem>
            <MenuItem
              rounded="8px"
              onClick={() => {
                router.push('create-template/upload');
              }}
            >
              Template
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <NavItem icon="overview" link="/">
        Dashboard
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
      {process.env.NODE_ENV === 'development' && (
        <Box>
          <Box
            mt="4"
            mb="2"
            mx="12"
            borderBottomWidth="1px"
            borderColor="gray.200"
          ></Box>
          <NavItem icon="test" link="/sandbox">
            Test
          </NavItem>
        </Box>
      )}
    </Box>
  );
};
