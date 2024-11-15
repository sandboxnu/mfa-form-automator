import { OverviewRow } from 'apps/web/src/components/OverviewRow';
import { Box, Text } from '@chakra-ui/react';
import { useForm } from '@web/hooks/useForm';
import Error from './../components/Error';
import FormLoading from './../components/FormLoading';
import { FormList } from './../components/FormList';
import { useAuth } from '@web/hooks/useAuth';
import { ProfileHover } from '@web/components/ProfileHover';

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
      <Box marginLeft="40px" height="100vh" marginTop="36px">
        <Text
          fontSize="30px"
          fontWeight="700"
          lineHeight="38px"
          marginBottom="5px"
        >
          Hello, {user?.firstName}!
        </Text>
        <Box marginBottom="40px">
          <OverviewRow
            title="To-do"
            color="#FFDFDE"
            link="/todo"
            formInstances={todoForms}
          />
        </Box>
        <FormList
          title={'Pending'}
          formInstances={pendingForms}
          color={'#FFECCC'}
          isDashboard={true}
          link={'/pending'}
        ></FormList>
        <ProfileHover
          firstName={'Lauren'}
          lastName={'Brissette'}
          position={'a very super long position'}
        />
      </Box>
    </>
  );
}
