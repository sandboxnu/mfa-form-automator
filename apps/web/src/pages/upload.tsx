
import {
    Flex,
    Text,
    Heading,
    Button,
    Box,
  } from '@chakra-ui/react';
import { UploadIcon } from '@web/static/icons';
  import { useRouter } from 'next/router';
import { useState } from 'react';

  export default function Upload() {
    const router = useRouter();
    const [pdf, setPdf] = useState<string | ArrayBuffer | null>(null);
    const [pdfName, setPdfName] = useState<string | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    /**
     * Set pdf state when a file is uploaded
    */
    const _handlePdfSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!e.target.files) return;
        try {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setPdf(url);
        setPdfName(file.name);
        setPdfFile(file);
        } catch (e) {
        console.error(e);
        }
    };

    return <Flex    display={'inline'}
                    paddingInline={'36px'}>
        <Heading 
            color="#2A2B2D"
            fontFamily="Hanken Grotesk"
            fontSize="30px"
            fontStyle="normal"
            fontWeight={700}
            lineHeight="38px"
            marginLeft="36px">
            Create form template
        </Heading>
        <Text
            color="#4B4C4F"
            fontSize="19px"
            fontWeight={500}
            lineHeight="26px"
            pl="36px">
            Upload your form PDF
        </Text>
        <Box 
            display="flex"
            padding="24px"
            flexDirection="column"
            justifyContent={"center"}
            alignItems="center"
            gap="10px"
            borderRadius="12px"
            border="1px solid #E5E5E5" 
            height="288px" 
            margin="16px 36px 16px 36px"
            backgroundColor="#FFF"
            alignContent={'center'}>
                <Box 
                    borderRadius="8px"
                    border="2px dashed #C3C7D1"
                    display={'flex'}
                    height="240px"
                    padding="40px 120px 48px 120px"
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}>
                        <Flex   flexDirection={'column'}
                                alignItems={'center'}
                                gap="16px">
                            <UploadIcon height="48px" width="66px"/>
                            <Flex gap="3px">
                                <Text 
                                fontWeight={500}
                                size="16px"
                                height="21px"
                                align="center">
                                    Drag file here or 
                                </Text>
                                <label htmlFor="pdfInput">
                                    <span>
                                        <Text
                                            textDecoration={"underline"}
                                            align="center"
                                            color="#1367EA"
                                            >browse</Text>
                                    </span>
                                    
                                </label>
                                <input
                                    type="file"
                                    id="pdfInput"
                                    accept=".pdf"
                                    style={{ display: 'none' }}
                                    onChange={(e) => _handlePdfSubmit(e)}
                                />
                                {pdfName && (
                                    <span
                                    style={{
                                        fontSize: '17px',
                                        fontStyle: 'italic',
                                        fontWeight: '400',
                                        lineHeight: 'normal',
                                        paddingLeft: '15px',
                                    }}
                                    >
                                    {pdfName}
                                    </span>
                                )}

                            </Flex>
                        </Flex>
                        
                        <Text
                            fontSize="14px"
                            color='#808080'
                            fontWeight={500}
                            >PDFs Only</Text>
                </Box>
        </Box>
        <Button
            borderRadius="6px"
            borderWidth="1.5px"
            borderStyle={'solid'}
            borderColor="#E23F40"
            alignContent={"center"}
            bgColor={'transparent'}
            _hover={{
                bgColor: 'transparent'
            }}
            marginLeft="36px">
                <Text
                    color="#E23F40"
                    fontWeight="600px"
                    fontSize="18px"
                    lineHeight="22px">
                       Delete
                </Text>   
        </Button>
        <Flex float="right" justifyContent={'space-between'}>
            <Button
                borderRadius="6px"
                borderWidth="1.5px"
                borderStyle={'solid'}
                borderColor="#1367EA"
                alignContent={"center"}
                bgColor={'transparent'}
                _hover={{
                    bgColor: 'transparent'
                }}>
                    <Text
                        color="#1367EA"
                        fontWeight="600px"
                        fontSize="18px"
                        lineHeight="22px">
                        Back
                    </Text>   
            </Button>
            <Button
                borderRadius="6px"
                alignContent={"center"}
                bgColor={'#1367EA'}
                _hover={{
                    bgColor: '#1367EA'
                }}
                marginLeft="12px"
                marginRight="36px"
                onClick={() => {router.push('')}}> 
                    <Text
                        color="#FCFCFC"
                        fontWeight="600px"
                        fontSize="18px"
                        lineHeight="22px">
                        Save & Continue
                    </Text>   
            </Button>
        </Flex>
        
       
    </Flex>
}