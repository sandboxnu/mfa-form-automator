import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { BlueTriangle, WhiteCheck } from '@web/static/icons';
import { useRouter } from 'next/router';

export const SideCreateForm = ({
  curStep,
  isFormTemplate,
}: {
  curStep: number;
  isFormTemplate: boolean;
}) => {
  const router = useRouter();

  const lineStyle = {
    marginLeft: '11px',
    marginTop: '2px',
    marginBottom: '2px',
    borderLeftWidth: '1px',
    borderLeftColor: '#A1A1A1',
    height: '28px',
  };

  const formTemplateLabels = [
    'Upload PDF',
    'Enter details',
    'Add input fields',
    'Review',
  ];
  const formInstanceLabels = [
    'Select template',
    'Edit details',
    'Assign groups',
    'Review',
  ];

  const Item = ({ num }: { num: number }) => (
    <Flex gap="10px" alignItems="center">
      {curStep <= num ? <NumberCircle num={num} /> : <BlueCheck />}
      <Text
        color={num <= curStep ? '#010101' : '#808080'}
        fontSize="16px"
        fontWeight="500"
        lineHeight="21px"
      >
        {isFormTemplate
          ? formTemplateLabels[num - 1]
          : formInstanceLabels[num - 1]}
      </Text>
    </Flex>
  );

  const BlueCheck = () => (
    <Flex
      width="24px"
      height="24px"
      justifyContent="center"
      alignItems="center"
      borderRadius="40px"
      bg="#1367EA"
    >
      <WhiteCheck height="10px" width="12px" />
    </Flex>
  );

  const NumberCircle = ({ num }: { num: number }) => (
    <Flex
      width="24px"
      height="24px"
      justifyContent="center"
      alignItems="center"
      borderRadius="40px"
      border={num === curStep ? 'none' : '1px solid #A1A1A1'}
      bg={num === curStep ? '#1367EA' : 'transparent'}
    >
      <Text
        color={num === curStep ? 'white' : '#808080'}
        fontSize="15px"
        fontWeight="500"
        lineHeight="21px"
      >
        {num}
      </Text>
    </Flex>
  );

  return (
    <Box
      as="nav"
      pos="fixed"
      top="64px"
      left="0"
      zIndex="1000"
      h="full"
      pb="10"
      overflow="visible"
      boxShadow="1px 0px 4px #E5E5E5"
      bg="#FEFEFE"
      _dark={{
        bg: 'gray.800',
      }}
      borderRightWidth="1px"
      width="242px"
    >
      <Flex
        direction="column"
        px="32px"
        pt="24px"
        gap="48px"
        alignItems="flex-start"
      >
        <Link onClick={() => router.push('/')}>
          <Flex alignItems="center" gap="8px">
            <BlueTriangle width="7.5px" height="8.75px" />
            <Text color="#1367EA" fontSize="15px" fontWeight="500">
              Back To Dashboard
            </Text>
          </Flex>
        </Link>

        <Box>
          {[1, 2, 3, 4].map((num) => (
            <Flex key={num} direction="column">
              <Item num={num} />
              {num < 4 && <Flex {...lineStyle} />}
            </Flex>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};
