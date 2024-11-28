import { Flex, Text, Heading, Button, Box } from '@chakra-ui/react';
import { SideCreateForm } from '@web/components/SideCreateForm';
import { CloseIcon, PDFIcon, UploadIcon } from '@web/static/icons';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';


export default function Upload() {
  const router = useRouter();
  const [pdf, setPdf] = useState<string | ArrayBuffer | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfSize, setPdfSize] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean | null>(true);

  const onDrop = useCallback((acceptedFiles: any) => {
    if(!acceptedFiles) return;
    saveFileData(acceptedFiles)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

  /**
   * Set pdf state when a file is uploaded
   */
  const _handlePdfSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    else {
      saveFileData(e.target.files);
    }
  };

  const saveFileData = (files:FileList) => {
    try {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPdf(url);
      setPdfName(file.name);
      setPdfFile(file);
      setPdfSize((file.size / 1000000).toFixed(2));
      setDisabled(false);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Clear pdf information when a file "x" is clicked
   */
  const _handlePdfDelete = (e: MouseEvent) => {
    e.preventDefault();
    setPdf(null);
    setPdfName(null);
    setPdfFile(null);
    setPdfSize(null);
    setDisabled(true);
  };

  return (
    <Box height="100vh" marginTop="36px">
      <Flex position="absolute" margin="0px" zIndex={5000}>
        <SideCreateForm curStep={1} />
      </Flex>

      <Heading
        color="#2A2B2D"
        fontSize="30px"
        fontWeight={700}
        lineHeight="38px"
        marginLeft="36px"
      >
        Create form template
      </Heading>
      <Text
        color="#4B4C4F"
        fontSize="19px"
        fontWeight={500}
        lineHeight="26px"
        pl="36px"
      >
        Upload your form PDF
      </Text>
      <Flex
        /* outer white box */
        padding="36px 24px 36px 24px"
        flexDirection="column"
        justifyContent={'center'}
        alignItems="center"
        gap="20px"
        borderRadius="12px"
        border="1px solid #E5E5E5"
        height="auto"
        margin="16px 36px 16px 36px"
        backgroundColor="#FFF"
        alignContent={'center'}
      >
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
          backgroundColor={pdfName ? '#F1F7FF' : '#FFF'}
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
            onChange={(e) => _handlePdfSubmit(e)}
            {...getInputProps()}
          />
        </Flex>
        {pdfName && (
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
                >
                  {pdfName}
                </Text>
                <Text
                  color="#808080"
                  textAlign="left"
                  fontSize="12px"
                  fontWeight={500}
                >
                  {pdfSize} mb
                </Text>
              </Flex>
            </Flex>
            <CloseIcon
              height="16px"
              width="16px"
              marginLeft="auto"
              onClick={(e) => _handlePdfDelete(e)}
            />
          </Flex>
        )}
      </Flex>
      <Button
        borderRadius="6px"
        borderWidth="1.5px"
        borderStyle={'solid'}
        borderColor="#E23F40"
        alignContent={'center'}
        bgColor={'transparent'}
        _hover={{
          bgColor: 'transparent',
        }}
        marginLeft="36px"
      >
        <Text
          color="#E23F40"
          fontWeight="600px"
          fontSize="18px"
          lineHeight="22px"
          onClick={(e) => _handlePdfDelete(e)}
        >
          Delete
        </Text>
      </Button>
      <Flex float="right" justifyContent={'space-between'}>
        <Button
          borderRadius="6px"
          borderWidth="1.5px"
          borderStyle={'solid'}
          borderColor="#1367EA"
          alignContent={'center'}
          bgColor={'transparent'}
          _hover={{
            bgColor: 'transparent',
          }}
        >
          <Text
            color="#1367EA"
            fontWeight="600px"
            fontSize="18px"
            lineHeight="22px"
          >
            Back
          </Text>
        </Button>
        <Button
          borderRadius="6px"
          alignContent={'center'}
          background={
            disabled
              ? 'linear-gradient(0deg, rgba(223, 223, 223, 0.50) 0%, rgba(223, 223, 223, 0.50) 100%), #1367EA;'
              : '#1367EA'
          }
          _hover={{
            background: 'auto',
          }}
          marginLeft="12px"
          marginRight="36px"
          onClick={() => {
            router.push('');
          }}
        >
          <Text
            color="#FCFCFC"
            fontWeight="600px"
            fontSize="18px"
            lineHeight="22px"
          >
            Save & Continue
          </Text>
        </Button>
      </Flex>
    </Box>
  );
}
