import { Box, Button, Flex, Text, Separator } from '@chakra-ui/react';
import {
  OverViewIcon,
  ToDoIcon,
  PendingIcon,
  CompletedIcon,
  PlusIcon,
  FormInstanceIcon,
  GrayPencilIcon,
  DropdownDownArrow,
  DropdownUpArrow,
  TemplateFolder,
  EmployeeDirectory,
  InstancesIcon,
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
import { useState } from 'react';

const icons = {
  overview: <OverViewIcon boxSize="20px" fill="#5E5E5E" />,
  overviewActive: <OverViewIcon boxSize="20px" fill="black" />,
  todo: (
    <ToDoIcon
      boxSize="28px"
      ml="-1"
      mr="-1"
      fill="#5E5E5E"
      stroke="#5E5E5E"
      strokeWidth="0.27"
    />
  ),
  todoActive: (
    <ToDoIcon
      boxSize="28px"
      ml="-1"
      mr="-1"
      fill="black"
      stroke="black"
      strokeWidth="0.27"
    />
  ),
  pending: <PendingIcon boxSize="24px" fill="#5E5E5E" />,
  pendingActive: <PendingIcon boxSize="24px" fill="black" strokeWidth="0.27" />,
  completed: <CompletedIcon boxSize="24px" stroke="#5E5E5E" fill="#5E5E5E" />,
  completedActive: (
    <CompletedIcon boxSize="24px" color="black" stroke="black" fill="black" />
  ),
  formInstance: <FormInstanceIcon boxSize="24px" mr="2" />,
  test: <GrayPencilIcon boxSize="24px" mr="2" />,
  testActive: <GrayPencilIcon boxSize="24px" mr="2" />,
  template: <TemplateFolder boxSize="24px" mr="2" fill="#5E5E5E" />,
  templateActive: <TemplateFolder boxSize="24px" mr="2" fill="black" />,
  employeeDirectory: <EmployeeDirectory boxSize="24px" mr="2" />,
  employeeDirectoryActive: <EmployeeDirectory boxSize="24px" mr="2" />,
  instances: <InstancesIcon boxSize="24px" mr="2" />,
  instancesActive: (
    <InstancesIcon boxSize="24px" mr="2" stroke="#5E5E5E" fill="#5E5E5E" />
  ),
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
        bg={isActive ? '#F3F6F8' : 'transparent'}
        _hover={{
          bg: '#F3F6F8',
        }}
        transition="background-color 0.2s ease"
        cursor="pointer"
      >
        <Flex align="center">
          <Flex minW="8" align="center">
            {icons[iconKey]}
          </Flex>
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
  const isAdmin = user?.scope == Scope.ADMIN;
  const isAdminOrContributor =
    user?.scope == Scope.ADMIN || user?.scope == Scope.CONTRIBUTOR;
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);

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
        <MenuRoot
          closeOnSelect
          open={isCreateDropdownOpen}
          onOpenChange={(e) => setIsCreateDropdownOpen(e.open)}
        >
          <MenuTrigger asChild>
            <Button
              h="40px"
              w="120px"
              bg="#1367EA"
              color="white"
              _hover={{
                bg: '#1058C7',
              }}
              fontSize={'16px'}
              fontWeight={600}
              borderRadius={'6px'}
            >
              <PlusIcon
                boxSize="14px"
                fill="white"
                stroke="white"
                stroke-width="0.38"
              />
              Create
              {isCreateDropdownOpen ? (
                <DropdownUpArrow boxSize="10px" />
              ) : (
                <DropdownDownArrow boxSize="10px" />
              )}
            </Button>
          </MenuTrigger>
          <MenuContent zIndex="1100" py="6px">
            {isAdminOrContributor && (
              <MenuItem
                onClick={() => router.push('create-template/upload')}
                value="template"
                padding="10px"
                w="140px"
                cursor="pointer"
                _hover={{
                  bg: '#EDF2F5',
                }}
              >
                Form template
              </MenuItem>
            )}
            <MenuItem
              onClick={() => router.push('create-instance/select-template')}
              value="form"
              padding="10px"
              w="140px"
              cursor="pointer"
              _hover={{
                bg: '#EDF2F5',
              }}
            >
              Form instance
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      </Flex>

      <Flex direction="column" w="100%" justifyContent="center">
        <NavItem icon="overview" link="/">
          Dashboard
        </NavItem>
        <NavItem icon="todo" link="/todo">
          To-Do
        </NavItem>
        <NavItem icon="pending" link="/pending">
          Pending
        </NavItem>
        <NavItem icon="completed" link="/completed">
          Completed
        </NavItem>

        {isAdmin && (
          <>
            <Flex paddingTop="20px" paddingBottom="20px" paddingLeft="50px">
              <Flex height="1px" width="140px" background={'#E0E0E0'} />
            </Flex>
            <NavItem icon="template" link="/template-directory">
              Templates
            </NavItem>
            <NavItem icon="instances" link="/instance-directory">
              Instances
            </NavItem>
            <NavItem icon="employeeDirectory" link="/employee-directory">
              Employees
            </NavItem>
          </>
        )}
      </Flex>
    </Box>
  );
};
