import { Assignee } from 'apps/web/src/utils/types';
import { Box, Text, Avatar, AvatarGroup, Tooltip, flexbox } from '@chakra-ui/react';
import '@fontsource/Hanken-Grotesk/800.css'
import '@fontsource/Hanken-Grotesk/400.css'

// Overview Form component for displaying forms in the dashboard
// will probably have to change the types once the backend is finished
export const FormCard = ({
  formName,
  assignees,
}: {
  formName: String;
  assignees: Array<Assignee>;
}) => {
  return (
    <>
      <Box
        w="246px"
        h="120px"
        borderRadius="5px"
        backgroundColor="#FFFFFF"
        boxShadow="0px 0.5px 3px 1px #D4D4D4"
        background="#FCFCFC"
      >
        <Box paddingLeft="24px" paddingTop="26px">
          <Text fontFamily="Hanken Grotesk" fontWeight={800} fontSize="18px">
            {formName}
          </Text>
          <AvatarGroup size="sm" max={5} marginTop="10px" spacing={"-3px"}>
            {assignees.map((assignee: Assignee, index: number) => {
              return (
                <Tooltip
                  bg={'white'}
                  color={'black'}
                  label={
                    <>
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {assignee.name}
                      </span>
                      <br />
                      {assignee.email}
                      <br />
                      <span
                        style={{
                          color: assignee.signed ? '#14A34A' : '#D74100',
                        }}
                      >
                        {assignee.signed ? 'Signed' : 'Not yet signed'}
                      </span>
                    </>
                  }
                  key={index}
                >
                  <Avatar
                    name={assignee.name}
                    key={index}
                    boxSize="32px"
                    backgroundColor={assignee.signed ? '#D1F0D4' : '#DCDCDC'}
                    outline="1px solid #FFFFFF"
                    color="black"
                    fontWeight={400}
                    fontSize="16px"
                    size="sm"
                    marginRight={"-3.5px"}
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
