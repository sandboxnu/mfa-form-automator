import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { SearchAndSort } from "@web/components/SearchAndSort";
import { TemplateSelectGrid } from '@web/components/createFormInstance/FormTemplateGrid';


export default function TemplateDirectory() {
    return( <>
    <Box height="100%" marginTop="36px" marginX={'40px'} gap='32px'>
      <Text
          fontSize="30px"
          fontWeight="700"
          lineHeight="38px"
          marginBottom="5px"
        >
          Templates
        </Text>
        <Flex flexDirection="row" height="46px" justifyContent="space-between" alignItems={"center"} alignSelf={"stretch"}>
          <Flex gap="8px">
          <Button borderRadius="28px" background={"var(--Blue, #1367EA)"} padding="4px 12px" display={"inline-flex"} height="28px">
            <Text color="#FFF" fontSize={"17px"} fontWeight={"500"}> 
              All Templates
            </Text>
          </Button>
          <Button borderRadius="28px" background={"var(--Highlight, #EEF5FF)"} padding="4px 12px" display={"inline-flex"} height="28px">
            <Text fontSize={"17px"} fontWeight={"500"}> 
              My Templates
            </Text>
          </Button>
          </Flex>
          
          <SearchAndSort searchQuery={""} setSearchQuery={function (searchQuery: string): void {
            throw new Error("Function not implemented.");
          } }/>
        </Flex>
        <TemplateSelectGrid allowCreate={false}/>

        <Flex padding="20px" justifyContent="space-between" alignItems="center" height="76px"
        alignSelf={"stretch"} backgroundColor="#FFF" borderColor="1px solid #E5E5E5" borderRadius={"8px"} position="sticky" bottom="0">
          <Text fontSize="19px" >
            Not seeing the form template you're looking for?
          </Text>
          <Button borderRadius="6px" border="1px solid #1367EA" background="#FFF">
            <Text fontFamily="Hanken Grotesk" color="#1367EA" fontSize="17px" fontWeight={"500px"} lineHeight={"20px"}>
            Create Form Template
            </Text>
          </Button>
        </Flex>
    </Box>
    </>);
  }
  