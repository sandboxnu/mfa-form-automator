import { Flex, Text } from '@chakra-ui/react';
import { CloseIcon, PDFIcon, UploadIcon } from '@web/static/icons';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * The content that will be in the white box for the upload step. This is a drop box and a file preview.
 */
export const UploadBox = ({
  pdfFile,
  clearPdfFile,
  setPdfFile,
}: {
  pdfFile: File | null;
  clearPdfFile: () => void;
  setPdfFile: (file: File) => void;
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Ensure the file is a PDF
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        alert('Please upload a valid PDF file.');
      }
    },
    [setPdfFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'], // Restrict file types to PDFs only
    },
  });

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
        backgroundColor={pdfFile ? '#F1F7FF' : '#FFF'}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <UploadIcon
          /* upload icon */
          height="48px"
          width="66px"
        />
        <Flex
          /* all text below icon */
          flexDirection={'column'}
          alignItems={'center'}
        >
          <Flex
            /* drag file here or browse line */
            gap="3px"
          >
            <Text
              fontWeight={500}
              fontSize="16px"
              height="21px"
              textAlign="center"
            >
              Drag file here or
            </Text>
            <Text
              fontWeight={500}
              fontSize="16px"
              height="21px"
              textAlign="center"
              textDecoration="underline"
              color="#1367EA"
            >
              Browse
            </Text>
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
      </Flex>
      {pdfFile && (
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
                {pdfFile?.name}
              </Text>
              <Text
                color="#808080"
                textAlign="left"
                fontSize="12px"
                fontWeight={500}
              >
                {pdfFile ? (pdfFile?.size / 1024 / 1024).toFixed(2) : `??`} MB
              </Text>
            </Flex>
          </Flex>
          <CloseIcon
            height="16px"
            width="16px"
            marginLeft="auto"
            onClick={clearPdfFile}
          />
        </Flex>
      )}
    </Flex>
  );
};
