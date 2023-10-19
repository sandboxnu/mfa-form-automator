import { Assignee } from 'apps/web/src/utils/types';
import { Box, Text, Avatar, AvatarGroup, Tooltip } from '@chakra-ui/react';

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
        <Box paddingLeft="28px" paddingTop="28px">
          <Text fontFamily="Helvetica" fontWeight={800} fontSize="18px">
            {formName}
          </Text>
          <AvatarGroup size="md" max={5} marginTop="10px">
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
                    boxSize="36px"
                    backgroundColor={assignee.signed ? '#D0F0DC' : '#DCDCDC'}
                    border="1px solid #FFFFFF"
                    color="black"
                    fontWeight={400}
                    fontSize="14px"
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
