import {
  AssignedGroupEntity,
  FormInstanceEntity,
  SignerType,
} from '@web/client';
import { User } from '@web/context/types';

/**
 * Determines if a form instance is fully signed
 *
 * @param formInstance the form instance to check
 * @returns true if the form instance is fully signed, false otherwise
 */
export const isFullySigned = (formInstance: FormInstanceEntity) => {
  const assignedGroups: AssignedGroupEntity[] = formInstance.assignedGroups;

  const unsignedAssignedGroups: AssignedGroupEntity[] = assignedGroups.filter(
    (assignedGroup: AssignedGroupEntity) => {
      return !assignedGroup.signed;
    },
  );

  return unsignedAssignedGroups.length === 0;
};

/**
 * Finds the name of the signer from a assigned group
 * @param assignedGroup the assigned group to check
 * @returns the name of the signer
 */
export const getNameFromAssignedGroup = (
  assignedGroup: AssignedGroupEntity,
) => {
  const signerType = assignedGroup.signerType as any;

  if (assignedGroup.signed || signerType === SignerType.USER) {
    return (
      assignedGroup.signerEmployee?.firstName! +
      ' ' +
      assignedGroup.signerEmployee?.lastName!
    );
  } else if (signerType === SignerType.DEPARTMENT) {
    return assignedGroup.signerDepartment?.name!;
  } else if (signerType === SignerType.POSITION) {
    return assignedGroup.signerPosition?.name!;
  } else if (signerType === SignerType.USER_LIST) {
    if (assignedGroup.signed) {
      return (
        assignedGroup.signerEmployee?.firstName! +
        ' ' +
        assignedGroup.signerEmployee?.lastName!
      );
    }
    return (
      assignedGroup.signerEmployeeList
        ?.map((employee) => {
          return employee.firstName + ' ' + employee.lastName;
        })
        .join(', ')
        .slice(0, 30) + '...'
    );
  }
  return '';
};

/**
 * Finds the initials of the signer from a assigned group
 * @param assignedGroup the assigned group to check
 * @returns the initials of the signer
 */
export const getInitialsFromAssignedGroup = (
  assignedGroup: AssignedGroupEntity,
) => {
  const signerType = assignedGroup.signerType;

  if (assignedGroup.signed || signerType === SignerType.USER) {
    return (
      assignedGroup.signerEmployee?.firstName! +
      ' ' +
      assignedGroup.signerEmployee?.lastName!
    );
  } else if (signerType === SignerType.DEPARTMENT) {
    return 'D';
  } else if (signerType === SignerType.POSITION) {
    return 'P';
  } else if (signerType === SignerType.USER_LIST) {
    return 'U';
  }
  return '';
};

/**
 * Finds the next signer in the assigned group chain of a form instance
 *
 * @param formInstance  the form instance to check
 * @returns the next signer in the assignedGroup chain
 */
export const nextSigner = (formInstance: FormInstanceEntity) => {
  const assignedGroups: AssignedGroupEntity[] = formInstance.assignedGroups;

  // Sort signatures by order
  assignedGroups.sort((a: AssignedGroupEntity, b: AssignedGroupEntity) => {
    return a.order - b.order;
  });

  // Find the first assigned group that is not signed
  const firstUnsignedAssignedGroup: AssignedGroupEntity | undefined =
    assignedGroups.find((assignedGroup: AssignedGroupEntity) => {
      return assignedGroup.signed === false;
    });

  return firstUnsignedAssignedGroup;
};

/**
 * Determines if a signature's next signer is the current user
 *
 * @param assignedGroup the assignedGroup to check
 * @param user the current user
 * @returns true if the next signer is the current user, false otherwise
 */
export const signerIsUser = (
  assignedGroup?: AssignedGroupEntity,
  user?: User,
) => {
  if (!assignedGroup || !user) return false;

  const signerType = assignedGroup.signerType;
  return (
    (signerType === SignerType.USER &&
      assignedGroup.signerEmployeeId === user?.id) ||
    (signerType === SignerType.POSITION &&
      assignedGroup.signerPositionId === user?.positionId) ||
    (signerType === SignerType.DEPARTMENT &&
      user?.departmentId === assignedGroup.signerDepartmentId) ||
    (signerType === SignerType.USER_LIST &&
      assignedGroup.signerEmployeeList?.some(
        (employee) => employee.id === user?.id,
      ))
  );
};
