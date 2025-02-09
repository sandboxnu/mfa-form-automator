import {
  FormInstanceEntity,
  SignatureEntity,
  SignerType,
} from '@web/client/types.gen.ts';
import { User } from '@web/context/types.ts';

/**
 * Determines if a form instance is fully signed
 *
 * @param formInstance the form instance to check
 * @returns true if the form instance is fully signed, false otherwise
 */
export const isFullySigned = (formInstance: FormInstanceEntity) => {
  const signatures: SignatureEntity[] = formInstance.signatures;

  const unsignedSignatures: SignatureEntity[] = signatures.filter(
    (signature: SignatureEntity) => {
      return !signature.signed;
    },
  );

  return unsignedSignatures.length === 0;
};

/**
 * Finds the name of the signer from a signature
 * @param signature the signature to check
 * @returns the name of the signer
 */
export const getNameFromSignature = (signature: SignatureEntity) => {
  const signerType = signature.signerType as any;

  if (signature.signed || signerType === SignerType.USER) {
    return (
      signature.signerEmployee?.firstName! +
      ' ' +
      signature.signerEmployee?.lastName!
    );
  } else if (signerType === SignerType.DEPARTMENT) {
    return signature.signerDepartment?.name!;
  } else if (signerType === SignerType.POSITION) {
    return signature.signerPosition?.name!;
  } else if (signerType === SignerType.USER_LIST) {
    if (signature.signed) {
      return (
        signature.signerEmployee?.firstName! +
        ' ' +
        signature.signerEmployee?.lastName!
      );
    }
    return (
      signature.signerEmployeeList
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
 * Finds the initials of the signer from a signature
 * @param signature the signature to check
 * @returns the initials of the signer
 */
export const getInitialsFromSignature = (signature: SignatureEntity) => {
  const signerType = signature.signerType;

  if (signature.signed || signerType === SignerType.USER) {
    return (
      signature.signerEmployee?.firstName! +
      ' ' +
      signature.signerEmployee?.lastName!
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
 * Finds the next signer in the signature chain of a form instance
 *
 * @param formInstance  the form instance to check
 * @returns the next signer in the signature chain
 */
export const nextSigner = (formInstance: FormInstanceEntity) => {
  const signatures: SignatureEntity[] = formInstance.signatures;

  // Sort signatures by order
  signatures.sort((a: SignatureEntity, b: SignatureEntity) => {
    return a.order - b.order;
  });

  // Find the first signature that doesn't have a signature
  const firstUnsignedSignature: SignatureEntity | undefined = signatures.find(
    (signature: SignatureEntity) => {
      return signature.signed === false;
    },
  );

  return firstUnsignedSignature;
};

/**
 * Determines if a signature's next signer is the current user
 *
 * @param signature the signature to check
 * @param user the current user
 * @returns true if the next signer is the current user, false otherwise
 */
export const signerIsUser = (signature?: SignatureEntity, user?: User) => {
  if (!signature || !user) return false;

  const signerType = signature.signerType;
  return (
    (signerType === SignerType.USER &&
      signature.signerEmployeeId === user?.id) ||
    (signerType === SignerType.POSITION &&
      signature.signerPositionId === user?.positionId) ||
    (signerType === SignerType.DEPARTMENT &&
      user?.departmentId === signature.signerDepartmentId) ||
    (signerType === SignerType.USER_LIST &&
      signature.signerEmployeeList?.some(
        (employee) => employee.id === user?.id,
      ))
  );
};
