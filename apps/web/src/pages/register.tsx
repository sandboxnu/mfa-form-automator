import {
  Flex,
  Box,
  Text,
  Button,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValueText,
  createListCollection,
  SelectRoot,
  SelectLabel,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@web/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useBlob } from '@web/hooks/useBlob';
import { SignaturePad } from './../components/SignaturePad';
import {
  departmentsControllerFindAllOptions,
  positionsControllerFindAllInDepartmentOptions,
} from '@web/client/@tanstack/react-query.gen';
import isAuth from '@web/components/isAuth';
import { useRouter } from 'next/router';
import { DepartmentEntity, PositionEntity } from '@web/client/types.gen';

function Register() {
  const router = useRouter();
  const { completeRegistration, user } = useAuth();
  const [currentDepartmentId, setCurrentDepartmentId] = useState<string[]>([]);
  const [currentPositionId, setCurrentPositionId] = useState<string[]>([]);
  const [createSignatureType, setCreateSignatureType] =
    useState<string>('draw');
  const [signatureText, setSignatureText] = useState<string>('');
  const signatureCanvas = useRef<any>(null);
  const { blob, setBlob } = useBlob();

  useEffect(() => {
    if (user && user.positionId) {
      router.push('/');
    }
  }, [router, user]);

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
        departmentId: currentDepartmentId[0] ?? '',
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
      await completeRegistration(currentPositionId[0], signatureUrl);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const departmentsCollection = createListCollection({
    items:
      departmentsData?.map((department) => ({
        label: department.name,
        value: department.name,
      })) ?? [],
  });

  const positionCollection = createListCollection({
    items:
      positionsData?.map((position) => ({
        label: position.name,
        value: position.name,
      })) ?? [],
  });

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
          <SelectRoot
            collection={departmentsCollection}
            width="320px"
            multiple={false}
            value={currentDepartmentId}
            onValueChange={(e) => setCurrentDepartmentId(e.value)}
          >
            <SelectLabel>Select your department</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              {departmentsData?.map((department: DepartmentEntity) => (
                <SelectItem item={department.name} key={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Box>

        <Box width="100%">
          <label htmlFor="positionDropdown">Position</label>

          <SelectRoot
            collection={positionCollection}
            width="320px"
            multiple={false}
            value={currentPositionId}
            onValueChange={(e) => setCurrentPositionId(e.value)}
          >
            <SelectLabel>Select your position</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select your position" />
            </SelectTrigger>
            <SelectContent>
              {positionsData?.map((position: PositionEntity) => (
                <SelectItem item={position.name} key={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
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
            disabled={!(currentDepartmentId && currentPositionId)}
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
