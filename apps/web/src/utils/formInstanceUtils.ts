import {
  AssignedGroupEntity,
  FieldGroupBaseEntity,
  FormInstanceEntity,
  SignerType,
} from '@web/client';
import { User } from '@web/context/types';
import { Dispatch, SetStateAction } from 'react';
import { groupColors } from './formTemplateUtils';
import {
  FieldType,
  FormFields,
} from '@web/components/createFormTemplate/types';

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
): string => {
  const signerType = assignedGroup.signerType;

  switch (signerType) {
    case SignerType.USER:
      return (
        assignedGroup.signerEmployee?.firstName! +
        ' ' +
        assignedGroup.signerEmployee?.lastName!
      );
    case SignerType.DEPARTMENT:
      return assignedGroup.signerDepartment?.name!;
    case SignerType.POSITION:
      return assignedGroup.signerPosition?.name!;
    case SignerType.USER_LIST:
      return (
        assignedGroup.signerEmployeeList
          ?.map((employee) => employee.firstName + ' ' + employee.lastName)
          .join(', ') || ''
      );
    default:
      return '';
  }
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
  assignedGroup: AssignedGroupEntity,
  user: User,
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

/**
 * Determines if a form instance is signed by the current user
 *
 * @param formInstance the form instance to check
 * @returns true if the form instance is signed by the current user, false otherwise
 */
export const isSignedByUser = (
  formInstance: FormInstanceEntity,
  user: User,
) => {
  const assignedGroups: AssignedGroupEntity[] = formInstance.assignedGroups;

  if (!assignedGroups || !user) return false;

  return assignedGroups.some((assignedGroup: AssignedGroupEntity) => {
    return (
      assignedGroup.signed &&
      assignedGroup.signingEmployeeId &&
      assignedGroup.signingEmployeeId === user.id
    );
  });
};

/**
 * Fetches a pdf file from a given link and sets it to the state
 * @param setPdfFile the state setter for the pdf file
 * @param formDocLink the link to the pdf file
 */
export const fetchPdfFile = async (
  setPdfFile: Dispatch<SetStateAction<File | null>>,
  formDocLink?: string,
) => {
  if (formDocLink) {
    const response = await fetch(formDocLink);
    const blob = await response.blob();
    const file = new File([blob], 'document.pdf', {
      type: 'application/pdf',
    });
    setPdfFile(file);
  }
};

export const formEditorTranslateFieldGroups = (
  fieldGroups: FieldGroupBaseEntity[],
) => {
  return new Map(
    fieldGroups.map((field, i) => [
      field.id,
      {
        border: groupColors[i % groupColors.length][0],
        background: groupColors[i % groupColors.length][1],
        groupName: `Group ${i + 1}`,
      },
    ]),
  );
};

export const formEditorTranslateFormFields: (
  fieldGroups: FieldGroupBaseEntity[],
) => FormFields = (fieldGroups: FieldGroupBaseEntity[]) => {
  return Object.fromEntries(
    fieldGroups.flatMap((fieldGroup) =>
      fieldGroup.templateBoxes.map((templateBox) => [
        templateBox.page,
        new Map([
          [
            templateBox.id,
            {
              position: {
                x: templateBox.x_coordinate,
                y: templateBox.y_coordinate,
                width: templateBox.width,
                height: templateBox.height,
              },
              groupId: fieldGroup.id,
              type:
                (templateBox.type as string) in FieldType
                  ? (templateBox.type as FieldType)
                  : FieldType.TEXT_FIELD,
            },
          ],
        ]),
      ]),
    ),
  );
};

export const getLatestSignedFormLink = (formInstance: FormInstanceEntity) => {
  let currentFormDocLink = null;

  for (const assignedGroup of formInstance.assignedGroups.sort(
    (a, b) => a.order - b.order,
  )) {
    if (assignedGroup.signedDocLink != null) {
      currentFormDocLink = assignedGroup.signedDocLink;
    }
  }
  return currentFormDocLink || formInstance.formDocLink;
};
