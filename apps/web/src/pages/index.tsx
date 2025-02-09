import { Box, Text } from '@chakra-ui/react';
import { useForm } from '@web/hooks/useForm';
import Error from './../components/Error';
import FormLoading from './../components/FormLoading';
import { FormList } from './../components/FormList';
import { useAuth } from '@web/hooks/useAuth';
import { OverviewRow } from '@web/components/OverviewRow';

export default function Overview() {
  const {
    todoForms,
    pendingForms,
    assignedFILoading,
    assignedFIError,
    createdFILoading,
    createdFIError,
  } = useForm();

  const { user } = useAuth();

  if (assignedFILoading || createdFILoading) return <FormLoading />;

  if (assignedFIError || createdFIError) return <Error />;

  return (
    <>
      <Box height="100%" marginTop="36px" marginX={'40px'}>
        <Text
          fontSize="30px"
          fontWeight="700"
          lineHeight="38px"
          marginBottom="5px"
        >
          Hello, {user?.firstName}!
        </Text>
        <Box marginBottom="50px">
          <OverviewRow
            title="To-do"
            color="#FFDFDE"
            link="/todo"
            formInstances={todoForms}
          />
        </Box>
        <Box marginBottom="50px">
          <FormList
            title={'Pending'}
            formInstances={pendingForms}
            color={'#FFECCC'}
            isDashboard={true}
            link={'/pending'}
          />
        </Box>
      </Box>
    </>
  );
}
