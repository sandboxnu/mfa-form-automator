import React from 'react';
import Error from '@web/components/Error';
import { FormInstanceEntity, Scope } from '@web/client';
import { User } from '@web/context/types';

interface EditGuardProps {
  user: User;
  formInstanceData: FormInstanceEntity;
  children: React.ReactNode;
  errorMessage?: string;
}

/**
 * A component that guards content based on user permissions.
 * Renders children only if the user has sufficient permissions.
 */
const EditGuard: React.FC<EditGuardProps> = ({
  user,
  formInstanceData,
  children,
  errorMessage = 'You do not have permission to edit this form instance',
}) => {
  // Check if user has permission (admin or originator)
  const hasPermission = user.id === formInstanceData?.originator.id;

  // Return error component if user doesn't have permission
  if (!hasPermission) {
    return <Error secondaryErrorMessage={errorMessage} />;
  }

  // Render children if user has permission
  return <>{children}</>;
};

export default EditGuard;
