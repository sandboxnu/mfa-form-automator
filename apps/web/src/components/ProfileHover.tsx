import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { SignedCheck, UnsignedX } from '@web/static/icons';
export const ProfileHover = ({
  firstName,
  lastName,
  position,
}: {
  firstName: String;
  lastName: String;
  position: String;
}) => {
  const signed = true;
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
        <Box width="84px" height="25px">
          <Text
            fontSize="15px"
            fontWeight="700"
            lineHeight="16px"
            overflow={'hidden'}
            width="95px"
            margin="0"
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
          >
            {firstName} {lastName}
          </Text>
          <Text
            fontWeight={400}
            width="95px"
            fontSize="12px"
            lineHeight="14px"
            textColor="#808080"
            overflow={'hidden'}
            margin="0"
            whiteSpace={'nowrap'}
            textOverflow={'ellipsis'}
          >
            {position}
          </Text>
        </Box>
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
