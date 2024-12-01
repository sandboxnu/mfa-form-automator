import { Box, Flex, Input, Link } from '@chakra-ui/react';
import { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ButtonSwitch } from '@web/components/ButtonSwitch';

interface SignaturePadProps {
  createSignatureType: string;
  setCreateSignatureType: (type: string) => void;
  signature: string;
  setSignature: (signature: string) => void;
  signatureCanvas: React.RefObject<SignatureCanvas>;
  onClear?: () => void;
}

export const SignaturePad = ({
  createSignatureType,
  setCreateSignatureType,
  signature,
  setSignature,
  signatureCanvas,
  onClear,
}: SignaturePadProps) => {
  const clearSignature = () => {
    if (signatureCanvas.current) {
      signatureCanvas.current.clear();
    }
    setSignature('');
    onClear?.();
  };

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column">
        <label htmlFor="signature">Create Signature</label>
        <Flex marginTop="8px" display="flex" justifyContent={'space-between'}>
          <Flex flex="1" flexDirection="column">
            <ButtonSwitch
              isToggleLeft={createSignatureType === 'draw'}
              onClickLeft={() => setCreateSignatureType('draw')}
              onClickRight={() => setCreateSignatureType('type')}
              activeColor="#1367EA"
              leftLabel="Draw"
              rightLabel="Type"
            />
          </Flex>
          <Flex flex="1" justifyContent="flex-end" alignItems="flex-end">
            <Link
              as="button"
              color="#1367EA"
              fontSize="14px"
              onClick={clearSignature}
            >
              Clear
            </Link>
          </Flex>
        </Flex>
        <Box
          borderRadius="6px"
          border="1px solid #C0C0C0"
          marginTop="8px"
          position="relative"
        >
          {createSignatureType === 'draw' ? (
            <>
              <SignatureCanvas
                penColor="black"
                canvasProps={{
                  width: 500,
                  height: 120,
                }}
                ref={signatureCanvas}
              />
              <Box
                position="absolute"
                bottom="16px"
                width="90%"
                height="1px"
                bg="#7C7F86"
                left="50%"
                transform="translateX(-50%)"
              />
            </>
          ) : (
            <Input
              type="text"
              placeholder="Type your signature here"
              padding="8px"
              borderRadius="6px"
              border="1px solid #C0C0C0"
              onChange={(e) => setSignature(e.target.value)}
              value={signature}
            />
          )}
        </Box>
      </Box>
    </>
  );
};
