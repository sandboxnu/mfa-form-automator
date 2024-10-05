import { Box, Text, Flex } from '@chakra-ui/react';
import { FormInstanceEntity } from './../../../web/src/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useStorage } from '@web/hooks/useStorage';
import { Document, Page, pdfjs } from 'react-pdf';

/**
 * @param formName - the name of the form
 * @param signatures - the signatures on the form
 * @param link - the link to the form
 * @returns a card for a form
 */
export const FormImageCard = ({
  formInstance,
  link,
}: {
  formInstance: FormInstanceEntity;
  link: string;
}) => {
  const router = useRouter();
  const { formURL } = useStorage(formInstance);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const daysAgo = (date1: string, date2: string) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffInTime = d2.getTime() - d1.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
    return diffInDays == 0 ? 'today' : `${diffInDays} days ago`;
  };

  return (
    <Box
      width="272px"
      borderRadius="5px"
      backgroundColor="#FFFFFF"
      boxShadow="0px 0.5px 3px 1px #DCDCDC"
      background="#FCFCFC"
      cursor="pointer"
      onClick={() => {
        router.push(link);
      }}
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
        >
          <Document file={formURL}>
            <Page
              width={264}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              pageNumber={1}
            />
          </Document>
        </Box>
      </Box>
      <Flex margin="15px" flexDirection="column" gap="12px">
        <Text
          padding={0}
          margin={0}
          fontFamily="Hanken Grotesk"
          fontWeight={500}
          fontSize="15px"
          isTruncated
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
            isTruncated
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
            isTruncated
          >
            Assigned {daysAgo(formInstance.createdAt, new Date().toISOString())}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};
