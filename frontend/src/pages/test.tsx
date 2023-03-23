import {
  Box,
} from '@chakra-ui/react';
import { OverviewForm } from '@/components/OverviewForm';

// page to test components
// using dummy data
export default function Test() {
  return <>
    <Box position="absolute" top="50vh" left="50vw">
      <OverviewForm formName="Placeholder Form" assignees={["Joe Smith", "Joe Smith", "Joe Smith", "Joe Smith"]} />
    </Box>
  </>;
}
