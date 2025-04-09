import { Box } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import { MFALogoIcon } from '@web/static/icons';
import { AzureSignin } from '@web/components/AzureSignin';
import { SignIn } from '@web/components/SignIn';
import { useAuth } from '@web/hooks/useAuth';
import { useRouter } from 'next/router';

export default function Signin() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/');
  }

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
          <Flex
            justifyContent="center"
            marginTop="32px"
            flexDirection={'column'}
          >
            <SignIn />
            <AzureSignin />
          </Flex>
        </Box>
      </Flex>
    </>
  );
}
