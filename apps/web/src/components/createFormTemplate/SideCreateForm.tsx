import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { BlueTriangle, WhiteCheck } from '@web/static/icons';
import { useRouter } from 'next/router';

export const SideCreateForm = ({ curStep }: { curStep: number }) => {
  const router = useRouter();

  const textStyle = {
    color: '#010101',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '21px',
  };

  const lineStyle = {
    marginLeft: '11px',
    marginTop: '2px',
    marginBottom: '2px',
    borderLeftWidth: '1px',
    borderLeftColor: '#A1A1A1',
    height: '28px',
  };

  const Item = ({ num }: { num: number }) => {
    return (
      <Flex gap="10px">
        {curStep <= num ? <NumberCircle num={num} /> : <BlueCheck />}
        <Text
          color={num <= curStep ? '#010101' : '#808080'}
          fontSize="16px"
          fontWeight="500"
          lineHeight="21px"
        >
          {num === 1
            ? 'Upload PDF'
            : num === 2
            ? 'Enter details'
            : num === 3
            ? 'Add input fields'
            : 'Review'}
        </Text>
      </Flex>
    );
  };

  const BlueCheck = () => {
    return (
      <Flex
        width="24px"
        height="24px"
        padding="4px"
        flexDirection="column"
        justifyContent={'center'}
        alignItems={'center'}
        gap="10px"
        borderRadius="40px"
        background="#1367EA"
      >
        <WhiteCheck height="10px" width="12px" />
      </Flex>
    );
  };

  const NumberCircle = ({ num }: { num: number }) => {
    return (
      <Flex
        width="24px"
        height="24px"
        padding="4px"
        flexDirection="column"
        justifyContent={'center'}
        alignItems={'center'}
        gap="10px"
        borderRadius="40px"
        border={num === curStep ? 'none' : '1px solid #A1A1A1'}
        backgroundColor={num === curStep ? '#1367EA' : 'transparent'}
      >
        <Text
          color={num === curStep ? 'white' : '#808080'}
          fontSize="15px"
          fontWeight={500}
          lineHeight="21px"
        >
          {num}
        </Text>
      </Flex>
    );
  };

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
    >
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        padding="24px 32px 0px 40px"
        rounded="8px"
        cursor="pointer"
        color="inherit"
        _dark={{
          color: 'gray.400',
        }}
        role="group"
        fontWeight="semibold"
        transition=".15s ease"
        width="242px"
      >
        <Flex
          width="165px"
          height="260px"
          flexDirection="column"
          alignItems="flex-start"
          gap="48px"
        >
          <Link
            onClick={(e) => {
              router.push('/');
            }}
          >
            <Flex alignItems={'center'} gap="8px">
              <BlueTriangle width="7.5px" height="8.75px" />
              <Text
                color="#1367EA"
                textAlign="right"
                fontSize="15px"
                fontWeight={500}
              >
                Back To Dashboard
              </Text>
            </Flex>
          </Link>
          <Box height="192px" flexShrink="0px" alignSelf="stretch">
            <Item num={1} />
            <Flex {...lineStyle}></Flex>
            <Item num={2} />
            <Flex {...lineStyle}></Flex>
            <Item num={3} />
            <Flex {...lineStyle}></Flex>
            <Item num={4} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
