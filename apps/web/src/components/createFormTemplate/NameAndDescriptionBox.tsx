import { Box, Text, Flex } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';

/**
 */
export const NameAndDescriptionBox = ({
  name,
  setName,
  description,
  setDescription

}: {
  name: string | null,
  setName: Dispatch<SetStateAction<string | null>>,
  description: string | null,
  setDescription: Dispatch<SetStateAction<string | null>>
}) => {

  const textInputStyle = {
    padding:"8px 10px",
    alignSelf: "stretch",
    alignItems: "flex-start",
    borderRadius: "4px",
    border:"1px solid #E5E5E5",
    background:"#F5F7FA",
    outlineColor: 'transparent',
    borderColor: 'transparent',
  }

  return (
    <Flex 
      flexDirection={'row'} 
      gap={'40px'}
      alignContent={'justify'}
      alignSelf="stretch"
      width="100%"
      >
      <Flex 
        flexDirection="column" 
        gap="24px"
        width="480px"
        alignItems={'flex-start'}>
          <Flex gap="10px" flexDirection="column" width="480px">
          <Text>Name</Text>
            <input
              type="text"
              onChange={(e) => setName(e.target.textContent)}
              style={{...textInputStyle}}
            />
        
          </Flex>
          <Flex gap="10px" flexDirection="column" width="480px">
          <Text>Description (optional)</Text>

          <textarea
                onChange={(e) => setDescription(e.target.textContent)}
                style={{
                  ...textInputStyle, 
                  height:"120px",
                  resize: 'none'
                }}
                placeholder='For HR processing lorem ipsum dolor sit'
                />
              </Flex>
      </Flex>
      <Flex justifyContent="center"
            alignItems="center"
            alignSelf="stretch"
            borderRadius='8px'
              border='1px solid #E5E5E5'
            >
      <embed
            src={''}
            type="application/pdf"
            width="400px"
            height="500px"
            style={{
              
              marginLeft: '50px',
              marginTop: '6px',
              marginBottom: '100px',
              minWidth: '436.353px',
              minHeight: '566.219px',
            }}
          />
      </Flex>
    </Flex>
  );
};
