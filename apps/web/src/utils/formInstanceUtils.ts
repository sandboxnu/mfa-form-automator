import { FormInstanceEntity, SignatureEntity } from '@web/client';

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
  if (signerType === 'USER') {
    return (
      signature.assignedUser?.firstName! +
      ' ' +
      signature.assignedUser?.lastName!
    );
  } else if (signerType === 'DEPARTMENT') {
    return signature.signerDepartment?.name!;
  } else if (signerType === 'POSITION') {
    return signature.signerPosition?.name!;
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
  if (signerType === 'USER') {
    return (
      signature.assignedUser?.firstName! +
      ' ' +
      signature.assignedUser?.lastName!
    );
  } else if (signerType === 'DEPARTMENT') {
    return 'D';
  } else if (signerType === 'POSITION') {
    return 'P';
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
