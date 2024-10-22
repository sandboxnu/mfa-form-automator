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
