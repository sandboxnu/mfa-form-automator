import { useContext } from 'react';
import { ApproveFormInstanceContext } from '@web/context/ApproveFormInstanceContext';

export const useApproveFormInstance = () =>
  useContext(ApproveFormInstanceContext);
