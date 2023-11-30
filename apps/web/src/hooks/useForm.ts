import { useEffect, useState } from 'react';
import {
  FormInstanceEntity,
  FormInstancesService,
  SignatureEntity,
} from './../../../web/src/client';
import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';

export const useForm = () => {
  const { user } = useAuth();

  const {
    isLoading: assignedFILoading,
    error: assignedFIError,
    data: assignedFIData,
  } = useQuery({
    queryKey: ['api/form-instances/me'],
    queryFn:
      FormInstancesService.formInstancesControllerFindAllAssignedToCurrentEmployee,
  });

  const {
    isLoading: createdFILoading,
    error: createdFIError,
    data: createdFIData,
  } = useQuery({
    queryKey: ['api/form-instances/created/me'],
    queryFn:
      FormInstancesService.formInstancesControllerFindAllCreatedByCurrentEmployee,
  });

  const [todoForms, setTodoForms] = useState<FormInstanceEntity[]>([]);
  const [pendingForms, setPendingForms] = useState<FormInstanceEntity[]>([]);
  const [completedForms, setCompletedForms] = useState<FormInstanceEntity[]>(
    [],
  );

  useEffect(() => {
    if (!assignedFIData || !createdFIData || !user) {
      setTodoForms([]);
      setPendingForms([]);
      setCompletedForms([]);
      return;
    }

    // Forms assigned to current user that they still need to sign
    const todoForms: FormInstanceEntity[] = assignedFIData.filter(
      (formInstance: FormInstanceEntity) => {
        const signatures: SignatureEntity[] = formInstance.signatures;
        for (let i = 0; i < signatures.length; i++) {
          if (signatures[i].signerPositionId === user.positionId) {
            return signatures[i].signed === false;
          }
        }
      },
    );

    // Forms created by current user that aren't completed (all/some/no signatures + not marked completed)
    const pendingForms: FormInstanceEntity[] = createdFIData.filter(
      (formInstance: FormInstanceEntity) => {
        return !formInstance.markedCompleted;
      },
    );

    // Forms created by current user that are completed (all signatures + marked completed)
    const completedForms: FormInstanceEntity[] = createdFIData.filter(
      (formInstance: FormInstanceEntity) => {
        return formInstance.markedCompleted;
      },
    );

    setTodoForms(todoForms);
    setPendingForms(pendingForms);
    setCompletedForms(completedForms);
  }, [assignedFIData, createdFIData, user]);

  return {
    todoForms,
    pendingForms,
    completedForms,
    assignedFILoading,
    assignedFIError,
    createdFILoading,
    createdFIError,
  };
};
