import { Box, Button, Flex, Text } from '@chakra-ui/react';
import {
  OverViewIcon,
  ToDoIcon,
  PendingIcon,
  CompletedIcon,
  PlusIcon,
  FormInstanceIcon,
  GrayPencilIcon,
} from 'apps/web/src/static/icons.tsx';
import Link from 'next/link.js';
import {
  MenuContent,
  MenuRoot,
  MenuTrigger,
  MenuItem,
} from '../components/ui/menu';
import { Scope } from '@web/client/types.gen';
import { useAuth } from '@web/hooks/useAuth';
import { useRouter } from 'next/router';

const icons = {
  overview: <OverViewIcon marginRight="2" boxSize="24px" />,
  overviewActive: <OverViewIcon marginRight="2" boxSize="24px" />,
  todo: <ToDoIcon marginRight="2" boxSize="24px" />,
  todoActive: <ToDoIcon marginRight="2" boxSize="24px" />,
  pending: <PendingIcon marginRight="2" boxSize="24px" />,
  pendingActive: <PendingIcon marginRight="2" boxSize="24px" />,
  completed: <CompletedIcon marginRight="2" boxSize="24px" />,
  completedActive: <CompletedIcon marginRight="2" boxSize="24px" />,
  formInstance: <FormInstanceIcon marginRight="2" boxSize="24px" />,
  test: <GrayPencilIcon marginRight="2" boxSize="24px" />,
  testActive: <GrayPencilIcon marginRight="2" boxSize="24px" />,
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
            color={isActive ? '#263345 !important' : ''}
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
  const { user } = useAuth();
  const isAdmin = user?.scope === Scope.ADMIN;

  return (
    <Box
      as="nav"
      pos="fixed"
      top="64px"
      left="224px"
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
      width="224px"
      {...props}
    >
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        mt="40px"
        mb="32px"
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
        <MenuRoot closeOnSelect={true}>
          <MenuTrigger asChild>
            <Button h="40px" w="124px" backgroundColor="#1367EA" color="white">
              <PlusIcon />
              Create
            </Button>
          </MenuTrigger>
          <MenuContent zIndex={5000}>
            <MenuItem
              rounded="8px"
              onClick={() => {
                router.push('create-instance/select-template');
              }}
              value="form"
              padding="10px"
              w="158px"
              cursor="pointer"
            >
              Form
            </MenuItem>
            {isAdmin && (
              <MenuItem
                rounded="8px"
                onClick={() => {
                  router.push('create-template/upload');
                }}
                value="template"
                padding="10px"
                w="158px"
                cursor="pointer"
              >
                Template
              </MenuItem>
            )}
          </MenuContent>
        </MenuRoot>
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
    </Box>
  );
};
