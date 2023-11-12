import { OverviewRow } from 'apps/web/src/components/OverviewRow';
import { Box } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './../hooks/useAuth';
import { FormInstanceEntity, FormInstancesService, SignatureEntity } from './../../../web/src/client';
import { useEffect, useState } from 'react';

// overview page
export default function Overview() {
  const { user } = useAuth();

  const { isLoading: assignedFILoading, error: assignedFIError, data: assignedFIData } = useQuery({
    queryKey: ['form-instances/me'],
    queryFn:
      FormInstancesService.formInstancesControllerFindAllAssignedToCurrentEmployee,
  });

  const { isLoading: createdFILoading, error: createdFIError, data: createdFIData } = useQuery({
    queryKey: ['form-instances/created/me'],
    queryFn: FormInstancesService.formInstancesControllerFindAllCreatedByCurrentEmployee,
  });

  const [todoForms, setTodoForms] = useState<FormInstanceEntity[]>([]);
  const [pendingForms, setPendingForms] = useState<FormInstanceEntity[]>([]);
  const [completedForms, setCompletedForms] = useState<FormInstanceEntity[]>([]);

  useEffect(() => {
    if (!assignedFIData || !createdFIData || !user) {
      setTodoForms([]);
      setPendingForms([]);
      setCompletedForms([]);
      return;
    }

    const todoForms: FormInstanceEntity[] = assignedFIData.filter((formInstance: FormInstanceEntity) => {
      const signatures: SignatureEntity[] = formInstance.signatures;
      for (let i = 0; i < signatures.length; i++) {
        if (signatures[i].signerPositionId === user.positionId) {
          return signatures[i].signed === false;
        }
      }
    });

    const pendingForms: FormInstanceEntity[] = createdFIData.filter((formInstance: FormInstanceEntity) => {
      return formInstance.completed === false;
    });

    const completedForms: FormInstanceEntity[] = createdFIData.filter((formInstance: FormInstanceEntity) => {
      return formInstance.completed === true;
    });

    setTodoForms(todoForms);
    setPendingForms(pendingForms);
    setCompletedForms(completedForms);

  }, [assignedFIData, createdFIData, user])


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
