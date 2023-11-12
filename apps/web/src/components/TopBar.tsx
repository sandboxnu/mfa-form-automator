import { MFALogoIcon, ProfileIcon } from 'apps/web/src/static/icons';
import { Box, Hide, IconButton, Text, Flex, Spacer } from '@chakra-ui/react';
import { useAuthData } from '@web/hooks/useAuthData';

export const TopBar: React.FC = () => {
  const { user } = useAuthData();

  return (
    <Flex
      as="header"
      align="center"
      pos="fixed"
      w="full"
      px="4"
      bg="white"
      _dark={{
        bg: 'gray.800',
      }}
      borderBottomWidth="1px"
      color="inherit"
      h="96px"
      zIndex="sticky"
    >
      <Box minWidth={302}>
        <Flex px="4" py="5" align="left">
          <MFALogoIcon height="51px" width="220px" />
        </Flex>
      </Box>
      <Spacer />

      <Flex align="center" pl="10">
        <Hide breakpoint="(max-width: 1000px)">
          <Text minW="200" align="right">
            Welcome back, {user?.firstName}!
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
