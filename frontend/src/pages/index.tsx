import { OverviewRow } from "@/components/OverviewRow";
import { todoForms, pendingForms, completedForms } from "data/seedData";
import { Box } from "@chakra-ui/react";

// overview page
export default function Overview() {
  return <>
    <Box marginLeft="40px" height="100vh">
      <Box marginTop="32px">
        <OverviewRow title="To Do" color="#FFDFDE" link="/todo" forms={todoForms}/>
      </Box>
      <Box marginTop="32px">
      <OverviewRow title="Pending" color="#FFECCC" link="/pending" forms={pendingForms}/>
      </Box>
      <Box marginTop="32px">
        <OverviewRow title="Completed" color="#D0F0DC" link="/completed" forms={completedForms}/>
      </Box>
    </Box>
  </>;
}