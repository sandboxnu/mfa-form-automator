import {
  Box,
  Text,
  Avatar,
  AvatarGroup,
  Tooltip,
  flexbox,
  Flex,
} from '@chakra-ui/react';
import { FormInstanceEntity, SignatureEntity } from './../../../web/src/client';
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

  let daysBetween = (date1: string, date2: string) => {
    if (date1) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffInTime = d2.getTime() - d1.getTime();
      const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
      return diffInDays;
    }
    return 0;
  };

  return (
    <>
      <Box
        minW="246px"
        minH="120px"
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
        <Box>
          <Box borderBottom="2px solid rgb(225,225,225)" padding="16px">
            <Box overflow="hidden" height="200px" filter="blur(2px)">
              <Document file={formURL}>
                <Page
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  pageNumber={1}
                  width={400}
                />
              </Document>
            </Box>
          </Box>
          <Flex
            margin="15px"
            height="75px"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Text
              padding={0}
              margin={0}
              fontFamily="Hanken Grotesk"
              fontWeight={800}
              fontSize="18px"
              isTruncated
            >
              {formInstance.name}
            </Text>
            <Flex display="flex" justifyContent="space-between">
              <Text
                textAlign="center"
                width="7vh"
                backgroundColor="#FFDFDE"
                fontFamily="Hanken Grotesk"
                fontWeight={800}
                fontSize="18px"
                isTruncated
                borderRadius="24px"
              >
                TO DO
              </Text>
              <Text
                textAlign="center"
                color="#5E5E5E"
                as="i"
                fontFamily="Hanken Grotesk"
                fontWeight={800}
                fontSize="18px"
                isTruncated
              >
                Assigned{' '}
                {daysBetween(formInstance.createdAt, new Date().toISOString())}d
                ago
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  );
};
