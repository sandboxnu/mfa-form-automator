import {
  Box,
  Text,
  Avatar,
  AvatarGroup
} from "@chakra-ui/react";

import { Assignee } from "utils/types";

// Overview Form component for displaying forms in the dashboard
// will probably have to change the types once the backend is finished
export const OverviewForm = ({ formName, assignees } : { formName: String, assignees: Array<Assignee> }) => {
  return <>
      <Box w={308} h={136} border="1px solid #C0C0C0" borderRadius={5}>
        <Box paddingLeft="28px" paddingTop="28px">
          <Text fontFamily="Helvetica" fontWeight={700} fontSize="22px">
            {formName}
          </Text>
          <AvatarGroup size="md" max={5} marginTop={19}>
            {assignees.map((assignee: Assignee, index: number) => {
              return <Avatar name={assignee.name} key={index} boxSize="36px" backgroundColor={assignee.signed ? "#D0F0DC" : "#FFFFFF"} border={assignee.signed ? "1px solid #BBDFC8" : "1px solid #A8A8A8"} color="black"/>
            })}
          </AvatarGroup>
        </Box>
      </Box>
  </>
}