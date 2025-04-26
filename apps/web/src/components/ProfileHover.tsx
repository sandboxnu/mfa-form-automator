import { Box, Flex, Text } from '@chakra-ui/react';
import { SignedCheck, UnsignedX } from '@web/static/icons.tsx';

export const ProfileHover = ({
  name,
  signedAt,
}: {
  name: string;
  signedAt: string | null;
}) => {
  return (
    <Box
      bg="#FFFFFF"
      padding="12px 10px 12px 10px"
      borderRadius="6px"
      zIndex={20}
    >
      <Box marginBottom="8px">
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
      </Box>

      {signedAt ? (
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
            Awaiting Signature
          </Text>
        </Flex>
      )}
    </Box>
  );
};
