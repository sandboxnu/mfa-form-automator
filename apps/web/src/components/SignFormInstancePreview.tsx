import { Avatar, Flex, Text } from '@chakra-ui/react';
import { ProfileIcon } from '@web/static/icons';
import { EmployeeEntity, FormInstanceEntity } from '@web/client/types.gen';

export const SignFormInstancePreview = ({}: {}) => {
  const textStyle = {
    color: '#010101',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '21px',
  };

  const lineStyle = {
    width: '1px',
    height: '33px',
    position: 'absolute',
    left: '16.5px',
    background: '#A1A1A1',
  };

  const RowItem = ({ signer }: { signer: EmployeeEntity }) => {
    return (
      <Flex
        flexDirection={'column'}
        alignItems="flex-start"
        gap="-4px"
        alignSelf="stretch"
      >
        <Flex alignItems={'center'} gap="8px">
          <Flex flex="1 0 0">
            <Text>{signer.firstName + ' ' + signer.lastName}</Text>
            <Text>Signed</Text>
          </Flex>
        </Flex>
        <Flex></Flex>
      </Flex>
    );
  };

  return (
    <Flex
      backgroundColor="#F8F9FA"
      padding="24px 32px"
      gap="24px"
      flexDirection="column"
      width="559px"
      height="554px"
      borderWidth={'2px'}
      borderColor="red"
      borderRadius="12px"
      box-shadow="0px 2px 16px 0px rgba(0, 0, 0, 0.15)"
    >
      <Flex
        width="495px"
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
      >
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          gap="24px"
          flex="1 0 0"
        >
          <Text
            fontFamily="Hanken Grotesk"
            fontSize="19px"
            fontWeight="700px"
            lineHeight="26px"
          >
            MFA Oracle Logon Request Form
          </Text>
          <Flex
            flexDirection="column"
            alignItems="flex-start"
            gap="8px"
            alignSelf="stretch"
          >
            <Text
              color="#010101"
              textAlign="center"
              fontSize="16px"
              fontWeight="600"
            >
              Description
            </Text>
            <Text color="#222324" fontSize="16px" fontWeight="400">
              For HR needs lorem ipsum dolor sit amet. Consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua.
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            alignItems="flex-start"
            gap="12px"
            alignSelf="stretch"
          >
            <Text
              color="#010101"
              textAlign="center"
              fontSize="16px"
              fontWeight="600"
            >
              Assigned by
            </Text>
            <Flex alignItems="center" gap="8px" alignSelf="stretch">
              <Avatar
                name={'LAUREN BRISSETTE'}
                display="flex"
                width="32px"
                height="32px"
                padding="6px 7px"
                justifyContent="center"
                alignItems="center"
                gap="10px"
                background="#DDD"
                color="#0C0C0C"
                border="1px solid #FFFFFF"
              />
              <Text color="#0C0C0C" fontSize="15px">
                Jane Doe
              </Text>
            </Flex>
          </Flex>
          <Flex
            flex-direction="column"
            align-items="flex-start"
            gap="12px"
            align-self="stretch"
          >
            <Text
              color="#010101"
              textAlign="center"
              fontSize="16px"
              fontWeight="600"
            >
              Assignees
            </Text>
            <Flex
              flex-direction="column"
              align-items="flex-start"
              gap="24px"
              align-self="stretch"
            ></Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
