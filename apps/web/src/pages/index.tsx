import { OverviewRow } from 'apps/web/src/components/OverviewRow';
import { Box } from '@chakra-ui/react';
import { useForm } from '@web/hooks/useForm';
import Error from './../components/Error';
import FormLoading from './../components/FormLoading';

export default function Overview() {
  const {
    todoForms,
    pendingForms,
    completedForms,
    assignedFILoading,
    assignedFIError,
    createdFILoading,
    createdFIError,
  } = useForm();

  if (assignedFILoading || createdFILoading) return <FormLoading />;

  if (assignedFIError || createdFIError) return <Error />;

  const rowWidth = Math.max(
    260 * 1.5,
    Math.min(
      4,
      Math.max(todoForms.length, pendingForms.length, completedForms.length),
    ) * 260,
  );

  return (
    <>
      <Box marginLeft="40px" height="100vh">
        <Box marginTop="32px">
          <OverviewRow
            title="To Do"
            color="#FFDFDE"
            link="/todo"
            formInstances={todoForms}
            rowWidth={rowWidth}
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
