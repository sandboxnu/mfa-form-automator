import { Button, Flex, Link, Text } from '@chakra-ui/react';
import { TopBar } from '@web/components/TopBar';
import { WhiteCheck } from '@web/static/icons';
import { useRouter } from 'next/router';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Review() {
  const router = useRouter();
  return (
    <>
      <TopBar />
      <Flex
        backgroundColor="#F8F9FA"
        justifyContent="center"
        alignItems="center"
        flexDirection={'column'}
      >
        <Flex
          padding="80px 120px 80px 120px"
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          gap="40px"
          marginTop="185px"
          marginBottom="471px"
          borderRadius={'12px'}
          border="1px solid #E5E5E5"
          background="#FFF"
          box-shadow="0px 1px 4px 0px #E5E5E5"
        >
          <Flex
            gap="16px"
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Flex
              width="56px"
              height="56px"
              padding="4px"
              flexDirection={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              gap="40px"
              borderRadius={'40px'}
              background={'#C3C7D1'}
            >
              <WhiteCheck width="31.2px" height="24px" flexShrink={'0px'} />
            </Flex>
            <Text fontSize={'21px'} color={'#32353B'} fontWeight={500}>
              Your form template has been created!
            </Text>
          </Flex>
          <Flex
            flexDirection={'column'}
            gap="12px"
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Button
              borderRadius={'6px'}
              background="#1367EA"
              padding="8px 18px 8px 18px"
              onClick={() => {
                router.push('/');
              }}
              _hover={{ backgroundColor: '#1367EA' }}
            >
              <Text
                color="#FCFCFC"
                fontSize="17px"
                fontWeight={600}
                lineHeight="20px"
              >
                Back To Dashboard
              </Text>
            </Button>
            <Link
              color="#1367EA"
              textDecoration={'underline'}
              onClick={(e) => {
                '/';
              }}
            >
              Create form instance
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
