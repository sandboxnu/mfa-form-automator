import { Flex, Box, Text, Select, Button } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { useAuth } from '@web/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useBlob } from '@web/hooks/useBlob';
import { SignaturePad } from './../components/SignaturePad';
import { DepartmentEntity, PositionEntity } from '@web/client';
import {
  departmentsControllerFindAllOptions,
  positionsControllerFindAllInDepartmentOptions,
} from '@web/client/@tanstack/react-query.gen';
import isAuth from '@web/components/isAuth';

function Register() {
  const { completeRegistration, user } = useAuth();
  const [currentDepartmentId, setCurrentDepartmentId] = useState<string>();
  const [currentPositionId, setCurrentPositionId] = useState<string>();
  const [createSignatureType, setCreateSignatureType] =
    useState<string>('draw');
  const [signatureText, setSignatureText] = useState<string>('');
  const signatureCanvas = useRef<any>(null);
  const { blob, setBlob } = useBlob();

  // Fetch departments and positions
  const { data: departmentsData } = useQuery({
    ...departmentsControllerFindAllOptions({
      query: {
        limit: 1000,
      },
    }),
  });

  const { data: positionsData } = useQuery({
    ...positionsControllerFindAllInDepartmentOptions({
      path: {
        departmentId: currentDepartmentId ?? '',
      },
      query: {
        limit: 1000,
      },
    }),
    enabled: !!currentDepartmentId,
  });

  // Convert data URL to blob for file upload
  const dataURLToBlob = (dataURL: string) => {
    const [header, byteString] = dataURL.split(',');
    const mimeString = header.split(':')[1].split(';')[0];
    const arrayBuffer = new Uint8Array(
      atob(byteString)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
    return new Blob([arrayBuffer], { type: mimeString });
  };

  // Create signature image (either text or canvas)
  const createSignatureImage = async () => {
    let file;

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
      file = new File([dataURLToBlob(dataUrl)], 'signature.png', {
        type: 'image/png',
      });
    } else {
      const dataUrl = signatureCanvas.current.toDataURL();
      file = new File([dataURLToBlob(dataUrl)], 'signature.png', {
        type: 'image/png',
      });
    }

    return await setBlob(file);
  };

  // Handle registration submission
  const handleRegistration = async () => {
    if (!currentDepartmentId || !currentPositionId) return;

    await createSignatureImage();
    const signatureUrl = blob
      ? // TODO: Do we want to store the URL representation of their signature?
        URL.createObjectURL(blob)
      : 'http://localhost:3002/signature.png';
    try {
      await completeRegistration(currentPositionId, signatureUrl);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <Flex
      as="section"
      bg="gray.50"
      _dark={{ bg: 'gray.700' }}
      minH="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        bg="#FFF"
        padding="40px 64px 40px 48px"
        borderRadius="12px"
        border="1px solid #E5E5E5"
        flexDir="column"
        alignItems="flex-start"
        gap="32px"
      >
        <Box>
          <Text
            color="#2A2B2D"
            fontSize="30px"
            fontWeight="600"
            fontFamily="Hanken Grotesk"
          >
            Hi {user?.firstName}, let&apos;s get you registered!
          </Text>
          <Text color="#4B4C4F" fontSize="16px" fontWeight="400">
            Please provide your department, position, and signature. <br /> You
            can update them anytime.
          </Text>
        </Box>

        <Box width="100%">
          <label htmlFor="departmentDropdown">Department</label>
          <Select
            id="departmentDropdown"
            placeholder="Select your department"
            onChange={(e) => setCurrentDepartmentId(e.target.value)}
            marginTop="8px"
          >
            {departmentsData?.map((department: DepartmentEntity) => (
              <option
                key={department.name}
                value={department.id}
                selected={department.id === currentDepartmentId}
              >
                {department.name}
              </option>
            ))}
          </Select>
        </Box>

        <Box width="100%">
          <label htmlFor="positionDropdown">Position</label>
          <Select
            id="positionDropdown"
            placeholder="Select your position"
            onChange={(e) => setCurrentPositionId(e.target.value)}
            disabled={!currentDepartmentId}
            marginTop="8px"
          >
            {positionsData?.map((position: PositionEntity) => (
              <option
                key={position.name}
                value={position.id}
                selected={position.id === currentPositionId}
              >
                {position.name}
              </option>
            ))}
          </Select>
        </Box>

        <SignaturePad
          createSignatureType={createSignatureType}
          setCreateSignatureType={setCreateSignatureType}
          signature={signatureText}
          setSignature={setSignatureText}
          signatureCanvas={signatureCanvas}
        />

        <Box>
          <Button
            onClick={handleRegistration}
            isDisabled={!(currentDepartmentId && currentPositionId)}
            bg="#1367EA"
            color="#FFF"
          >
            Continue
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}

export default isAuth(Register);
