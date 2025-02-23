import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { SignedCheck, UnsignedX } from '@web/static/icons.tsx';

export const ProfileHover = ({
  name,
  signed,
}: {
  name: String;
  signed: boolean;
}) => {
  return (
    <Box
      width="216px"
      bg="#FFFFFF"
      padding="12px 10px 12px 10px"
      borderRadius="6px"
      zIndex={20}
    >
      <Flex gap="0px">
        <Box>
          <Text
            fontSize="15px"
            fontWeight="700"
            lineHeight="16px"
            overflow={'hidden'}
            width="130px"
            margin="0"
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
          >
            {name}
          </Text>
          <Text
            fontSize="12px"
            fontWeight="700"
            lineHeight="16px"
            overflow={'hidden'}
            width="130px"
            margin="0"
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
            color="#4B4C4F"
          >
            TITLE GOES HERE
          </Text>
        </Box>

        <Center>
          {signed ? (
            <Flex alignItems={'center'}>
              <SignedCheck width="14px" height="14px" />
              <Text
                fontWeight={600}
                fontSize="13px"
                lineHeight="16px"
                css={{ '--color': '#14A34A' }}
              >
                Signed
              </Text>
            </Flex>
          ) : (
            <Flex gap="5px">
              <UnsignedX width="14px" height="14px" />
              <Text
                fontWeight={600}
                fontSize="13px"
                lineHeight="16px"
                css={{ '--color': '#BD2828' }}
              >
                Awaiting
              </Text>
            </Flex>
          )}
        </Center>
      </Flex>
    </Box>
  );
};
