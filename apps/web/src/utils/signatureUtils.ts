import { RefObject } from 'react';
import SignatureCanvas from 'react-signature-canvas';

// Create signature image (either text or canvas)
export const createSignatureImage: (
  createSignatureType: any,
  signatureText: string,
  signatureCanvas: RefObject<SignatureCanvas>,
) => Promise<string | undefined> = async (
  createSignatureType,
  signatureText,
  signatureCanvas,
) => {
  if (createSignatureType === 'type' && signatureText) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 120;
    ctx.font = '40px "TheChairman"';
    const textWidth = ctx.measureText(signatureText).width;
    ctx.fillText(
      signatureText,
      canvas.width / 2 - textWidth / 2,
      canvas.height / 2 + 15,
    );

    const dataUrl = canvas.toDataURL();
    return dataUrl;
  } else {
    // Get the signature canvas reference
    const signPad = signatureCanvas?.current;
    if (!signPad || signPad.isEmpty()) return undefined;

    // Use trimmed data URL to avoid excessive whitespace
    // This preserves the exact signature as drawn by the user with proper size
    return signPad.toDataURL('image/png');
  }
};
