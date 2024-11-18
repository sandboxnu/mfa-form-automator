import { Box, Flex, Text } from '@chakra-ui/react';
import { SignedCheck, UnsignedX } from '@web/static/icons';
export const ProfileHover = ({
  name,
  signed,
}: {
  name: String;
  signed: boolean;
}) => {
  return (
    <Box
      width="186px"
      height="57px"
      bg="#FFFFFF"
      padding="16px 14px 16px 14px"
      gap="10px"
      borderRadius="6px"
      boxShadow="1px 1px 4px 0px #D4D4D4"
    >
      <Flex width="158px" height="25px" alignItems={'center'}>
          <Text
            fontSize="15px"
            fontWeight="700"
            lineHeight="16px"
            overflow={'hidden'}
            width="185px"
            margin="0"
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
          >
            {name}
          </Text>
        <Flex
          width="100%"
          height="25px"
          justifyContent={'right'}
          alignItems={'center'}
        >
          {signed ? (
            <>
              <SignedCheck width="14px" height="14px" />
              <Text
                pl="3px"
                fontWeight={600}
                fontSize="13px"
                lineHeight="16px"
                textColor="#14A34A"
              >
                Signed
              </Text>
            </>
          ) : (
            <>
              <UnsignedX width="14px" height="14px" />
              <Text
                pl="3px"
                fontWeight={600}
                fontSize="13px"
                lineHeight="16px"
                textColor="#BD2828"
              >
                Awaiting
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
