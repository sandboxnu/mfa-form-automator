import { OverviewRow } from 'apps/web/src/components/OverviewRow';
import { Box } from '@chakra-ui/react';
import { useAuth } from './../hooks/useAuth';
import { useForm } from '@web/hooks/useForm';

// overview page
export default function Overview() {
  useAuth();

  const { todoForms, pendingForms, completedForms, assignedFILoading, assignedFIError, createdFILoading, createdFIError } = useForm();

  if (assignedFILoading || createdFILoading) return <p>Loading</p>;

  if (assignedFIError || createdFIError) return <p>Error</p>

  const rowWidth = Math.max(246 * 1.5, Math.max(todoForms.length, pendingForms.length, completedForms.length) * 246);

  return (
    <>
      <Box marginLeft="40px" height="100vh">
        <Box marginTop="32px">
          <OverviewRow
            title="To Do"
            color="#FFDFDE"
            link="/todo"
            formInstances={todoForms}
            rowWidth = {rowWidth}
          />
        </Box>
        <Box marginTop="32px">
          <OverviewRow
            title="Pending"
            color="#FFECCC"
            link="/pending"
            formInstances={pendingForms}
            rowWidth={rowWidth}
          />
        </Box>
        <Box marginTop="32px">
          <OverviewRow
            title="Completed"
            color="#D0F0DC"
            link="/completed"
            formInstances={completedForms}
            rowWidth={rowWidth}
          />
        </Box>
      </Box>
    </>
  );
}
