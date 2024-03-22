import { Button, Box } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { MFALogoIcon } from '@web/static/icons';
import { useAuth } from '@web/hooks/useAuth';

export default function Signin() {
  const { session, signIn, signOut } = useAuth();

  if (!session) {
    return (
      <>
        <Flex
          justifyContent={'center'}
          marginTop={'168px'}
          marginBottom={'100px'}
        >
          <Box
            width="480px"
            borderRadius="8px"
            background="#FFF"
            boxShadow="0px 0px 6px 1px #D4D4D4"
            padding="48px"
          >
            <Flex justifyContent={'center'}>
              <MFALogoIcon width="150px" height="30px" marginBottom="20px" />
            </Flex>
            <Flex justifyContent="center" marginTop="32px" marginBottom="48px">
              <Button
                background="#4C658A"
                color="#FFF"
                onClick={async () => signIn('azure-ad')}
              >
                Sign In with Azure Entra SSO
              </Button>
            </Flex>
          </Box>
        </Flex>
      </>
    );
  } else {
    return (
      <>
        <Flex
          justifyContent={'center'}
          marginTop={'168px'}
          marginBottom={'100px'}
        >
          <button onClick={signOut}>Sign Out</button>
        </Flex>
      </>
    );
  }
}
