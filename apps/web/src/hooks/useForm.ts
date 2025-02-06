import { useMemo, useState } from 'react';
import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';
import {
  isFullySigned,
  nextSigner,
  signerIsUser,
} from '@web/utils/formInstanceUtils';
import {
  formInstancesControllerFindAllAssignedToCurrentEmployee,
  formInstancesControllerFindAllCreatedByCurrentEmployee,
  FormInstanceEntity,
  SignatureEntity,
} from '@web/client';

/**
 * @returns an object containing the todo, pending, and completed forms
 */
export const useForm = () => {
  const { user } = useAuth();

  const {
    isLoading: assignedFILoading,
    error: assignedFIError,
    data: assignedFIData,
  } = useQuery({
    queryKey: ['api', 'form-instances'],
    queryFn: formInstancesControllerFindAllAssignedToCurrentEmployee,
  });

  const {
    isLoading: createdFILoading,
    error: createdFIError,
    data: createdFIData,
  } = useQuery({
    queryKey: ['api', 'form-instances', 'created', 'me'],
    queryFn: formInstancesControllerFindAllCreatedByCurrentEmployee,
  });

  const [todoForms, setTodoForms] = useState<FormInstanceEntity[]>([]);
  const [pendingForms, setPendingForms] = useState<FormInstanceEntity[]>([]);
  const [completedForms, setCompletedForms] = useState<FormInstanceEntity[]>(
    [],
  );

  /**
   * Determines if a form instance is created by the current user
   *
   * @param formInstance the form instance to check
   * @returns true if the form instance is created by the current user, false otherwise
   */
  const isOriginator = (formInstance: FormInstanceEntity) => {
    return formInstance.originator.id === user?.id;
  };

  /**
   * Determines if a form instance is signed by the current user
   *
   * @param formInstance the form instance to check
   * @returns true if the form instance is signed by the current user, false otherwise
   */
  const isSignedByUser = (formInstance: FormInstanceEntity) => {
    const signatures: SignatureEntity[] = formInstance.signatures;

    return signatures.some((signature: SignatureEntity) => {
      return signature.signerEmployeeId === user?.id && signature.signed;
    });
  };

  useMemo(() => {
    if (!assignedFIData || !createdFIData || !user) {
      setTodoForms([]);
      setPendingForms([]);
      setCompletedForms([]);
      return;
    }

    // Forms assigned to current user that they still need to sign
    const todoForms: FormInstanceEntity[] =
      assignedFIData.data?.filter((formInstance: FormInstanceEntity) => {
        return signerIsUser(nextSigner(formInstance)!, user);
      }) ?? [];

    // Forms created by current user that are fully signed but not marked completed
    const todoApproveForms: FormInstanceEntity[] =
      createdFIData.data?.filter((formInstance: FormInstanceEntity) => {
        return (
          isFullySigned(formInstance) &&
          isOriginator(formInstance) &&
          !formInstance.markedCompleted
        );
      }) ?? [];

    // Forms created by current user that are not fully signed but the next signer is not the current user since that would be in the todo list
    const originatorPendingForms: FormInstanceEntity[] =
      createdFIData.data?.filter((formInstance: FormInstanceEntity) => {
        return (
          !isFullySigned(formInstance) &&
          !signerIsUser(nextSigner(formInstance)!, user)
        );
      }) ?? [];

    // Forms assigned to current user that are not fully signed or marked completed but are signed by the current user and not created by the current user
    const signerPendingForms: FormInstanceEntity[] =
      assignedFIData.data?.filter((formInstance: FormInstanceEntity) => {
        return (
          isSignedByUser(formInstance) &&
          !formInstance.markedCompleted &&
          !isOriginator(formInstance)
        );
      }) ?? [];

    // Forms created by current user that are fully signed and marked completed
    const originatorCompletedForms: FormInstanceEntity[] =
      createdFIData.data?.filter((formInstance: FormInstanceEntity) => {
        return isFullySigned(formInstance) && formInstance.markedCompleted;
      }) ?? [];

    // Forms assigned to current user that are fully signed and marked completed but not created by the current user
    const signerCompletedForms: FormInstanceEntity[] =
      assignedFIData.data?.filter((formInstance: FormInstanceEntity) => {
        return (
          isFullySigned(formInstance) &&
          formInstance.markedCompleted &&
          !isOriginator(formInstance)
        );
      }) ?? [];

    setTodoForms([...todoForms, ...todoApproveForms]);
    setPendingForms([...originatorPendingForms, ...signerPendingForms]);
    setCompletedForms([...originatorCompletedForms, ...signerCompletedForms]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
