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
import Link from 'next/link';
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
  overview: <OverViewIcon boxSize="24px" mr="2" />,
  overviewActive: <OverViewIcon boxSize="24px" mr="2" />,
  todo: <ToDoIcon boxSize="24px" mr="2" />,
  todoActive: <ToDoIcon boxSize="24px" mr="2" />,
  pending: <PendingIcon boxSize="24px" mr="2" />,
  pendingActive: <PendingIcon boxSize="24px" mr="2" />,
  completed: <CompletedIcon boxSize="24px" mr="2" />,
  completedActive: <CompletedIcon boxSize="24px" mr="2" />,
  formInstance: <FormInstanceIcon boxSize="24px" mr="2" />,
  test: <GrayPencilIcon boxSize="24px" mr="2" />,
  testActive: <GrayPencilIcon boxSize="24px" mr="2" />,
};

type IconKeys = keyof typeof icons;

const NavItem = ({
  children,
  icon,
  link,
}: {
  children: React.ReactNode;
  icon: IconKeys;
  link: string;
}) => {
  const router = useRouter();
  const isActive = router.pathname === link;
  const iconKey = isActive ? (`${icon}Active` as IconKeys) : icon;

  return (
    <Link href={link} passHref>
      <Box
        px="8"
        py="2"
        bg={isActive ? '#EFEFEF' : 'transparent'}
        _hover={{
          bg: '#F4F4F4',
        }}
        transition="background-color 0.2s ease"
        cursor="pointer"
      >
        <Flex align="center">
          {icons[iconKey]}
          <Text
            fontWeight={isActive ? 'bold' : 'normal'}
            color={isActive ? '#263345' : 'inherit'}
          >
            {children}
          </Text>
        </Flex>
      </Box>
    </Link>
  );
};

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
      left="0"
      zIndex="1000"
      h="full"
      width="240px"
      overflowY="auto"
      boxShadow="1px 0px 4px rgba(0, 0, 0, 0.1)"
      bg="#FEFEFE"
      borderRightWidth="1px"
      {...props}
    >
      <Flex mt="24px" mb="32px" px="8">
        <MenuRoot closeOnSelect>
          <MenuTrigger asChild>
            <Button
              h="40px"
              w="124px"
              bg="#1367EA"
              color="white"
              _hover={{
                bg: '#1257C3',
              }}
            >
              <PlusIcon />
              Create
            </Button>
          </MenuTrigger>
          <MenuContent zIndex="1100">
            <MenuItem
              onClick={() => router.push('create-instance/select-template')}
              value="form"
              padding="10px"
              w="158px"
              cursor="pointer"
              _hover={{
                bg: '#F4F4F4',
              }}
            >
              Form
            </MenuItem>
            {isAdmin && (
              <MenuItem
                onClick={() => router.push('create-template/upload')}
                value="template"
                padding="10px"
                w="158px"
                cursor="pointer"
                _hover={{
                  bg: '#F4F4F4',
                }}
              >
                Template
              </MenuItem>
            )}
          </MenuContent>
        </MenuRoot>
      </Flex>

      <Flex direction="column" gap="2" w="100%" justifyContent="center">
        <NavItem icon="overview" link="/">
          Dashboard
        </NavItem>
        <NavItem icon="todo" link="/todo">
          To Do
        </NavItem>
        <NavItem icon="pending" link="/pending">
          Pending
        </NavItem>
        <NavItem icon="completed" link="/completed">
          Completed
        </NavItem>
      </Flex>
    </Box>
  );
};
