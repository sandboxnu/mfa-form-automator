import { AssignedGroupEntityHydrated, SignerType } from '@web/client';

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

/**
 * Determine if an assigned group is active based on signer type
 * @param assignedGroup - The assigned group to check
 * @returns boolean indicating if the assigned group is active
 */
export const getIsActive = (
  assignedGroup: AssignedGroupEntityHydrated,
): boolean => {
  const { signerType } = assignedGroup;

  // Department or Position are always active
  if (
    signerType === SignerType.DEPARTMENT ||
    signerType === SignerType.POSITION
  ) {
    return true;
  }

  // For User type, check if the user is active
  if (signerType === SignerType.USER) {
    return assignedGroup?.signerEmployee?.isActive ?? false;
  }

  // For User List type, check if any user in the list is active
  if (signerType === SignerType.USER_LIST) {
    return (
      assignedGroup?.signerEmployeeList?.some(
        (employee) => employee.isActive,
      ) ?? false
    );
  }

  // Default case for unknown signer types
  return false;
};
