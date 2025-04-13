import { useQuery } from '@tanstack/react-query';
import { FormInstanceEntity } from '@web/client';
import {
  formInstancesControllerFindAllAssignedToCurrentEmployeeOptions,
  formInstancesControllerFindAllCreatedByCurrentEmployeeOptions,
} from '@web/client/@tanstack/react-query.gen';
import {
  signerIsUser,
  nextSigner,
  isFullySigned,
  isSignedByUser,
} from '@web/utils/formInstanceUtils';
import { UserFormsContextType } from './types';
import { createContext, useContext, useMemo, useState } from 'react';
import { useAuth } from '@web/hooks/useAuth';

export const UserFormsContext = createContext<UserFormsContextType>(
  {} as UserFormsContextType,
);

export const UserFormsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  const {
    isLoading: assignedFILoading,
    error: assignedFIError,
    data: assignedFIData,
  } = useQuery({
    ...formInstancesControllerFindAllAssignedToCurrentEmployeeOptions(),
    enabled: !!user,
  });

  const {
    isLoading: createdFILoading,
    error: createdFIError,
    data: createdFIData,
  } = useQuery({
    ...formInstancesControllerFindAllCreatedByCurrentEmployeeOptions(),
    enabled: !!user,
  });

  const [todoForms, setTodoForms] = useState<FormInstanceEntity[]>([]);
  const [pendingForms, setPendingForms] = useState<FormInstanceEntity[]>([]);
  const [completedForms, setCompletedForms] = useState<FormInstanceEntity[]>(
    [],
  );

  useMemo(() => {
    /**
     * Determines if a form instance is created by the current user
     *
     * @param formInstance the form instance to check
     * @returns true if the form instance is created by the current user, false otherwise
     */
    const isOriginator = (formInstance: FormInstanceEntity) => {
      return formInstance.originator.id === user?.id;
    };

    if (!assignedFIData || !createdFIData || !user) {
      setTodoForms([]);
      setPendingForms([]);
      setCompletedForms([]);
      return;
    }

    // Forms assigned to current user that they still need to sign
    const todoForms: FormInstanceEntity[] = assignedFIData.filter(
      (formInstance: FormInstanceEntity) => {
        return signerIsUser(nextSigner(formInstance)!, user);
      },
    );

    // Forms created by current user that are fully signed but not marked completed
    const todoApproveForms: FormInstanceEntity[] =
      createdFIData.filter((formInstance: FormInstanceEntity) => {
        return (
          isFullySigned(formInstance) &&
          isOriginator(formInstance) &&
          !formInstance.markedCompleted
        );
      }) ?? [];

    // Forms created by current user that are not fully signed but the next signer is not the current user since that would be in the todo list
    const originatorPendingForms: FormInstanceEntity[] = createdFIData.filter(
      (formInstance: FormInstanceEntity) => {
        return (
          !isFullySigned(formInstance) &&
          !signerIsUser(nextSigner(formInstance)!, user)
        );
      },
    );

    // Forms assigned to current user that are not fully signed or marked completed but are signed by the current user and not created by the current user
    const signerPendingForms: FormInstanceEntity[] = assignedFIData.filter(
      (formInstance: FormInstanceEntity) => {
        return (
          isSignedByUser(formInstance, user) &&
          !formInstance.markedCompleted &&
          !isOriginator(formInstance)
        );
      },
    );

    // Forms created by current user that are fully signed and marked completed
    const originatorCompletedForms: FormInstanceEntity[] = createdFIData.filter(
      (formInstance: FormInstanceEntity) => {
        return isFullySigned(formInstance) && formInstance.markedCompleted;
      },
    );

    // Forms assigned to current user that are fully signed and marked completed but not created by the current user
    const signerCompletedForms: FormInstanceEntity[] = assignedFIData.filter(
      (formInstance: FormInstanceEntity) => {
        return (
          isFullySigned(formInstance) &&
          formInstance.markedCompleted &&
          !isOriginator(formInstance)
        );
      },
    );

    setTodoForms([...todoForms, ...todoApproveForms]);
    setPendingForms([...originatorPendingForms, ...signerPendingForms]);
    setCompletedForms([...originatorCompletedForms, ...signerCompletedForms]);
  }, [assignedFIData, createdFIData, user]);

  return (
    <UserFormsContext.Provider
      value={{
        todoForms,
        pendingForms,
        completedForms,
        assignedFILoading,
        assignedFIError,
        createdFILoading,
        createdFIError,
      }}
    >
      {children}
    </UserFormsContext.Provider>
  );
};

export const useUserFormsContext = () => useContext(UserFormsContext);
