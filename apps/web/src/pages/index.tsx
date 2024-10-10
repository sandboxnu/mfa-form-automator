import { OverviewRow } from 'apps/web/src/components/OverviewRow';
import { Box } from '@chakra-ui/react';
import { useForm } from '@web/hooks/useForm';
import Error from './../components/Error';
import FormLoading from './../components/FormLoading';
import { FormList } from './../components/FormList';
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
      <Box marginLeft="40px" height="100vh" marginTop="36px">
        <Box marginBottom="40px">
          <OverviewRow
            title="To-do"
            color="#FFDFDE"
            link="/todo"
            formInstances={todoForms}
            rowWidth={rowWidth}
          />
        </Box>
        <FormList
          title={'Pending'}
          formInstances={pendingForms}
          color={'#FFECCC'}
          isDashboard={true}
          link={'/pending'}
        ></FormList>
      </Box>
    </>
  );
}
