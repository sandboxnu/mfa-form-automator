import { Flex, Text, Heading, Button, Box } from '@chakra-ui/react';
import { CloseIcon, PDFIcon, UploadIcon } from '@web/static/icons';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * The content that will be in the white box for the upload step.  This is a drop box and a file preview.
 * @param blob the useBlob() instance we are using to store the data
 */
export const UploadBox = ({
  // TODO: rather than importing useBlob as type any, it should be stored in universally
  blob,
}: {
  blob: any;
}) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    if (!acceptedFiles) return;
    blob.uploadLocalFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Flex flexDirection="column" gap="20px">
      <Flex
        /* dashed bordered box */
        borderRadius="8px"
        border="2px dashed #C3C7D1"
        height="240px"
        padding="40px 120px 48px 120px"
        gap="16px"
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        backgroundColor={blob.hasLocalBlob ? '#F1F7FF' : '#FFF'}
        {...getRootProps()}
      >
        <UploadIcon
          /* upload icon */
          height="48px"
          width="66px"
        />
        <Flex
          /* all text below icon*/
          flexDirection={'column'}
          alignItems={'center'}
        >
          <Flex
            /* drag file here or browse line */
            gap="3px"
          >
            <Text fontWeight={500} size="16px" height="21px" align="center">
              Drag file here or
            </Text>
            <label htmlFor="pdfInput">
              <span>
                <Text
                  textDecoration={'underline'}
                  align="center"
                  color="#1367EA"
                >
                  browse
                </Text>
              </span>
            </label>
          </Flex>
          <Text
            /* pdf qualifier */
            fontSize="14px"
            color="#808080"
            fontWeight={500}
          >
            PDFs Only
          </Text>
        </Flex>
        <input
          type="file"
          id="pdfInput"
          accept=".pdf"
          style={{ display: 'none' }}
          {...getInputProps()}
        />
      </Flex>
      {blob.hasLocalBlob && (
        <Flex
          /* box that shows pdf information */
          width="414px"
          padding="12px 16px"
          borderRadius="8px"
          border="1px solid #C3C7D1"
        >
          <Flex flexDirection={'row'} gap="12px">
            <Flex
              padding="4px"
              flexDirection={'column'}
              alignItems={'flex-start'}
              borderRadius="4px"
              background="#E1E2E7"
              alignSelf={'center'}
            >
              <PDFIcon width="16px" height="7.111px" />
            </Flex>
            <Flex flexDirection={'column'}>
              <Text
                color="#000"
                textAlign="center"
                fontSize="14px"
                fontWeight={500}
                overflow={'hidden'}
                whiteSpace="nowrap"
                maxWidth={'320px'}
                textOverflow={'ellipsis'}
              >
                {blob.localBlobData.name}
              </Text>
              <Text
                color="#808080"
                textAlign="left"
                fontSize="12px"
                fontWeight={500}
              >
                {blob.localBlobData.size} mb
              </Text>
            </Flex>
          </Flex>
          <CloseIcon
            height="16px"
            width="16px"
            marginLeft="auto"
            onClick={() => blob.clearLocalBlob()}
          />
        </Flex>
      )}
    </Flex>
  );
};
