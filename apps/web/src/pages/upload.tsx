
import {
    Flex,
    Text,
    Heading,
    Button,
    Box,
    background,
  } from '@chakra-ui/react';
export default function Upload() {
    return <Flex display={'inline'}
    paddingInline={'36px'}>
        <Heading 
            color="#2A2B2D"
            fontFamily="Hanken Grotesk"
            fontSize="30px"
            fontStyle="normal"
            fontWeight={700}
            lineHeight="38px"
            pt="36px"
            pl="36px">
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
            marginTop="16px"
            marginBottom="16px"
            marginLeft="36px"
            marginRight="36px"
            backgroundColor="#FFF">
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
        <Button
            borderRadius="6px"
            alignContent={"center"}
            bgColor={'#1367EA'}
            _hover={{
                bgColor: '#1367EA'
            }}
            float="right"
            marginLeft="12px"
            marginRight="36px">
                <Text
                    color="#FCFCFC"
                    fontWeight="600px"
                    fontSize="18px"
                    lineHeight="22px">
                       Save & Continue
                </Text>   
        </Button>
        <Button
            borderRadius="6px"
            borderWidth="1.5px"
            borderStyle={'solid'}
            borderColor="#1367EA"
            alignContent={"center"}
            bgColor={'transparent'}
            float="right"
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
       
    </Flex>
}