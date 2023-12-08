import { Box, Text, Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react';
import { SignatureEntity } from './../../../web/src/client';
import { useRouter } from 'next/router';

// Overview Form component for displaying forms in the dashboard
// will probably have to change the types once the backend is finished
export const FormCard = ({
  formName,
  signatures,
  link,
}: {
  formName: String;
  signatures: SignatureEntity[];
  link: string;
}) => {
  const router = useRouter();

  return (
    <>
      <Box
        w="246px"
        h="120px"
        borderRadius="5px"
        backgroundColor="#FFFFFF"
        boxShadow="0px 0.5px 3px 1px #D4D4D4"
        background="#FCFCFC"
        cursor="pointer"
        onClick={() => {
          router.push(link);
        }}
        _hover={{
          boxShadow: '0px 0.5px 6px 1px #D4D4D4',
        }}
      >
        <Box paddingLeft="24px" paddingTop="26px">
          <Text fontFamily="Hanken Grotesk" fontWeight={800} fontSize="18px">
            {formName}
          </Text>
          {/*Dummy values until userSignedBy fixed*/}
          <AvatarGroup size="sm" max={5} marginTop="10px" spacing={'-3px'}>
            {signatures
              .sort((a, b) => a.order - b.order)
              .map((signature: SignatureEntity, index: number) => {
                return (
                  <Tooltip
                    bg={'white'}
                    color={'black'}
                    placement="bottom-start"
                    label={
                      <>
                        <Text fontSize="16px" fontWeight="bold">
                          {signature.signerPosition.name}
                        </Text>
                        {signature.userSignedBy && (
                          <Text>
                            {signature.userSignedBy?.firstName +
                              ' ' +
                              signature.userSignedBy?.lastName}
                          </Text>
                        )}
                      </>
                    }
                    key={index}
                  >
                    <Avatar
                      name={signature.signerPosition.name}
                      key={index}
                      boxSize="32px"
                      backgroundColor={signature.signed ? '#D1F0D4' : '#DCDCDC'}
                      outline="1px solid #FFFFFF"
                      color="black"
                      fontWeight={400}
                      fontSize="16px"
                      size="sm"
                      marginRight={'-3.5px'}
                    />
                  </Tooltip>
                );
              })}
          </AvatarGroup>
        </Box>
      </Box>
    </>
  );
};
