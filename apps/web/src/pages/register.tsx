import { Button, Flex } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { DepartmentsService, PositionsService } from '@web/client';
import { DepartmentEntity } from '@web/client';
import { PositionEntity } from '@web/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@web/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

export default function Register() {
  const router = useRouter();
  const { completeRegistration, userData } = useAuth();
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);
  const [currentDepartment, setCurrentDepartment] = useState<string>('');
  const [currentPosition, setCurrentPosition] = useState<string>('');

  useEffect(() => {
    if (userData) {
      setCurrentDepartment(userData.department);
      setCurrentPosition(userData.position);
      setLoadingUserData(false);
    }
  }, [userData]);

  const {
    isLoading: positionsLoading,
    error: positionsError,
    data: positionsData,
  } = useQuery({
    queryKey: ['api', 'positions'],
    queryFn: () => PositionsService.positionsControllerFindAll(1000),
  });

  const {
    isLoading: departmentsLoading,
    error: departmentsError,
    data: departmentsData,
  } = useQuery({
    queryKey: ['api', 'departments'],
    queryFn: () => DepartmentsService.departmentsControllerFindAll(1000),
  }); 

  // If loading, wait to render
  if (positionsLoading || departmentsLoading || loadingUserData) {
    return <div>Loading...</div>;
  }

  // when button is submitted to finalize department and position, register employee
  // with current position and department and route to home page
  const clickResponse = () => {
    if (!currentDepartment || !currentPosition) {
      return;
    }

    // complete registration
    completeRegistration(
      userData.email,
      userData.password,
      currentPosition,
      currentDepartment,
    );
    // redirect to main page
    router.push('/');
  };

  return (
    <>
      <Heading as="h2" textColor="#363940" fontSize="30px" padding="50px">
        Hi there, it looks like you are not registered yet.
      </Heading>
      <Heading as="h3" textColor="#363940" pl="50px">
        Please specify your department and position below
      </Heading>
      <Flex
        padding="50px"
        width="80vw"
        justifyContent="center"
        alignItems="center"
      >
        <Heading as="h2" textColor="#363940" fontSize="24px" width="200px">
          Select Department
        </Heading>
        <Select
          placeholder={
            currentDepartment
              ? currentDepartment.toString()
              : 'Select Department'
          }
          onChange={(e) => setCurrentDepartment(e.target.value)}
        >
          {departmentsData?.map(
            (department: DepartmentEntity, index: number) => {
              return (
                <option key={index} value={department.name}>
                  {department.name}
                </option>
              );
            },
          )}
        </Select>
      </Flex>
      <Flex
        padding="50px"
        width="80vw"
        justifyContent="center"
        alignItems="center"
      >
        <Heading as="h2" textColor="#363940" fontSize="24px" width="200px">
          Select Position
        </Heading>
        <Select
          id="positionDropdown"
          placeholder={
            currentPosition ? currentPosition.toString() : 'Select Position'
          }
          onChange={(e) => setCurrentPosition(e.target.value)}
        >
          {positionsData?.map((position: PositionEntity, index: number) => {
            return (
              <option key={index} value={position.name}>
                {position.name}
              </option>
            );
          })}
        </Select>
      </Flex>
      <Button
        alignSelf="center"
        marginLeft="50px"
        onClick={clickResponse}
        disabled={!(currentDepartment && currentPosition)}
      >
        Submit
      </Button>
    </>
  );
}
