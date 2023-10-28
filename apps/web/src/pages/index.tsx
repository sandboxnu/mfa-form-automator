import { OverviewRow } from 'apps/web/src/components/OverviewRow';
import {
  completedForms,
  pendingForms,
  todoForms,
} from 'apps/web/src/data/seedData';
import { Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

// overview page
export default function Overview() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['form-instances/me'],
  });

  if (error) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  // placeholder
  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <Box marginLeft="40px" height="100vh">
        <Box marginTop="32px">
          <OverviewRow
            title="To Do"
            color="#FFDFDE"
            link="/todo"
            formInstances={todoForms}
          />
        </Box>
        <Box marginTop="32px">
          <OverviewRow
            title="Pending"
            color="#FFECCC"
            link="/pending"
            formInstances={pendingForms}
          />
        </Box>
        <Box marginTop="32px">
          <OverviewRow
            title="Completed"
            color="#D0F0DC"
            link="/completed"
            formInstances={completedForms}
          />
        </Box>
      </Box>
    </>
  );
}
