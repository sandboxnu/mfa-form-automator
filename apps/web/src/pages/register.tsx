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
  positionsControllerFindAllInDepartmentNameOptions,
} from '@web/client/@tanstack/react-query.gen';
import { Scope } from '@web/client';

export default function Register() {
  const { completeRegistration, userData } = useAuth();
  const [currentDepartmentName, setCurrentDepartmentName] = useState<string[]>(
    [],
  );
  const [currentPositionName, setCurrentPositionName] = useState<string[]>([]);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);
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
    ...positionsControllerFindAllInDepartmentNameOptions({
      path: {
        departmentName: currentDepartmentName[0],
      },
      query: {
        limit: 1000,
      },
    }),
    enabled: currentDepartmentName.length === 1,
  });

  useEffect(() => {
    if (userData) {
      setCurrentDepartmentName(userData.departmentId);
      setCurrentPositionName(userData.positionId);
      setLoadingUserData(false);
    }
  }, [userData]);

  if (loadingUserData) {
    return <div>Loading...</div>;
  }

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
    if (currentDepartmentName.length != 1 || currentPositionName.length != 1)
      return;

    await createSignatureImage();
    const signatureUrl = blob
      ? // TODO: Do we want to store the URL representation of their signature?
        URL.createObjectURL(blob)
      : 'http://localhost:3002/signature.png';
    completeRegistration(
      userData.email,
      userData.password,
      currentDepartmentName[0],
      currentPositionName[0],
      signatureUrl,
      Scope.BASE_USER,
    );
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
            Hi {userData.displayName.split(' ')[0]}, let&apos;s get you
            registered!
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
            value={currentDepartmentName}
            onValueChange={(e) => setCurrentDepartmentName(e.value)}
          >
            <SelectLabel>Select your department</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              {departmentsCollection.items.map((department) => (
                <SelectItem item={department} key={department.value}>
                  {department.label}
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
            value={currentPositionName}
            onValueChange={(e) => setCurrentPositionName(e.value)}
          >
            <SelectLabel>Select your position</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select your position" />
            </SelectTrigger>
            <SelectContent>
              {positionCollection.items.map((position) => (
                <SelectItem item={position} key={position.value}>
                  {position.label}
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
            disabled={!(currentDepartmentName && currentPositionName)}
            bg="#1367EA"
            color="#FFF"
          >
            Sign In
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
