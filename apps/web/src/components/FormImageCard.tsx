import { Box, Text, Flex } from '@chakra-ui/react';
import { PDFDocument } from './PDFDocument';
import { FormInstanceEntity } from '@web/client/types.gen';
import { MouseEventHandler } from 'react';

/**
 * @param formInstance - the form instance entity
 * @param onClick - the click handler for the card
 * @returns a responsive card for a form with image preview
 */
export const FormImageCard = ({
  formInstance,
  onClick,
}: {
  formInstance: FormInstanceEntity;
  onClick: MouseEventHandler<HTMLDivElement>;
}) => {
  const daysAgo = (date1: Date, date2: Date) => {
    const diffInTime = date1.getTime() - date2.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
    return diffInDays == 0 ? 'today' : `${diffInDays} days ago`;
  };

  return (
    <Box
      width="272px"
      minW="272px"
      maxW="272px"
      paddingBottom="10px"
      borderRadius="8px"
      backgroundColor="#FFFFFF"
      border="1px solid #D4D4D4"
      background="#FCFCFC"
      cursor="pointer"
      onClick={onClick}
      _hover={{
        boxShadow: '0px 0.5px 6px 1px #DCDCDC',
      }}
    >
      <Box height="132px" borderBottom="2px solid rgb(225,225,225)">
        <Box
          paddingTop="4px"
          paddingLeft="4px"
          paddingRight="4px"
          overflow="hidden"
          height="full"
          filter="blur(2px)"
          transition="filter 0.3s ease" // Smooth transition for the blur effect
          _hover={{
            filter: 'blur(0px)',
          }}
        >
          <PDFDocument formLink={formInstance.formDocLink} />
        </Box>
      </Box>
      <Flex padding="12px" flexDirection="column" gap="12px">
        <Text
          padding={0}
          margin={0}
          color="#0C0C0C"
          fontFamily="Hanken Grotesk"
          fontWeight={500}
          fontSize="15px"
          height="21px"
        >
          {formInstance.name}
        </Text>
        <Flex display="flex" justifyContent="space-between" alignItems="center">
          <Text
            textAlign="center"
            width="auto"
            backgroundColor="#FFDFDE"
            fontFamily="Hanken Grotesk"
            fontWeight={700}
            fontSize="12px"
            borderRadius="20px"
            padding="3px 12px"
          >
            TO DO
          </Text>
          <Text
            textAlign="center"
            color="#5E5E5E"
            as="i"
            fontFamily="Hanken Grotesk"
            fontWeight={500}
            fontSize="13px"
          >
            Assigned {daysAgo(new Date(), new Date(formInstance.createdAt))}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
