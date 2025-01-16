import { useQuery } from '@tanstack/react-query';
import {
  FormInstanceEntity,
  PositionsService,
  SignatureEntity,
} from '@web/client';
import { User } from '@web/context/types';
import { useState } from 'react';

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

  if (signature.signed || signerType === 'USER') {
    return (
      signature.signerEmployee?.firstName! +
      ' ' +
      signature.signerEmployee?.lastName!
    );
  } else if (signerType === 'DEPARTMENT') {
    return signature.signerDepartment?.name!;
  } else if (signerType === 'POSITION') {
    return signature.signerPosition?.name!;
  } else if (signerType === 'USER_LIST') {
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
  const signerType = signature.signerType as any;

  if (signature.signed || signerType === 'USER') {
    return (
      signature.signerEmployee?.firstName! +
      ' ' +
      signature.signerEmployee?.lastName!
    );
  } else if (signerType === 'DEPARTMENT') {
    return 'D';
  } else if (signerType === 'POSITION') {
    return 'P';
  } else if (signerType === 'USER_LIST') {
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
export const signerIsUser = (signature: SignatureEntity, user: User) => {
  if (!signature) return false;

  const signerType = signature.signerType as any;
  return (
    (signerType === 'USER' && signature.signerEmployeeId === user?.id) ||
    (signerType === 'POSITION' &&
      signature.signerPositionId === user?.positionId) ||
    (signerType === 'DEPARTMENT' &&
      user?.departmentId === signature.signerDepartmentId) ||
    (signerType === 'USER_LIST' &&
      signature.signerEmployeeList?.some(
        (employee) => employee.id === user?.id,
      ))
  );
};
