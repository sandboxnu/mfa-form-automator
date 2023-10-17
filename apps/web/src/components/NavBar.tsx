import { Box, Button, Flex, Divider, Spacer } from '@chakra-ui/react';
import {
  OverViewIcon,
  ToDoIcon,
  PendingIcon,
  CompletedIcon,
  HistoryIcon,
  SettingsIcon,
  PlusIcon,
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
};

// navigation item abstraction to include the Link and styling
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
            color: 'gray.400',
          }}
          _hover={{
            bg: '#EFEFEF !important',
            color: 'gray.900',
          }}
          style={{
            fontWeight: isActive ? '800' : 'normal',
          }}
          bg={isActive ? '#EFEFEF' : 'white'}
          role="group"
          fontWeight="semibold"
          transition=".15s ease"
        >
          {icons[icon as keyof typeof icons]}
          {children}
        </Flex>
      </Box>
    </Link>
  );
};




// Navbar component
export const NavBar: React.FC = (props: any) => (
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
      bg: 'gray.800',
    }}
    border
    color="inherit"
    borderRightWidth="1px"
    width="80"
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
    color: 'gray.400',
  }}
  role="group"
  fontWeight="semibold"
  transition=".15s ease"
>
  <Link href="/createform" passHref>
     <Button
            marginY="5"
            height="40px"
            width="156px"
            justifyContent="center"
            bg="#D74100"
            textColor="white"
            textAlign="center"
            fontSize="sm"
            backgroundColor="#4C658A"
            fontWeight="900"
            _focus={{ outline: 'none', boxShadow: 'none' }}
          >
            <PlusIcon marginRight={11} />
            Create Form
          </Button>
  </Link>
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
      <Box px={8}>
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
        bottom="160px"
      >
        Museum of Fine Arts, Boston
      </Box>
      <Spacer minH="30vh" />
    </Flex>
  </Box>
);
