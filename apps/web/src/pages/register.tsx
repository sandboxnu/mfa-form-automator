import { Button, Flex } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { DepartmentsService, PositionsService } from '@web/client';
import { DepartmentEntity } from '@web/client';
import { PositionEntity } from '@web/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@web/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Register() {
  const router = useRouter();
  const { completeRegistration, userData } = useAuth();
  const [currentDepartmentName, setCurrentDepartmentName] =
    useState<string>('');
  const [currentPositionName, setCurrentPositionName] = useState<string>('');
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);

  useEffect(() => {
    if (userData) {
      setCurrentDepartmentName(userData.departmentId);
      setCurrentPositionName(userData.positionId);
      setLoadingUserData(false);
    }
  }, [userData]);

  const {
    isLoading: departmentsLoading,
    error: departmentsError,
    data: departmentsData = [],
  } = useQuery({
    queryKey: ['api', 'departments'],
    queryFn: () => DepartmentsService.departmentsControllerFindAll(1000),
  });

  const {
    isLoading: positionsLoading,
    error: positionsError,
    data: positionsData = [],
  } = useQuery({
    queryKey: ['api', 'positions', currentDepartmentName],
    queryFn: () =>
      PositionsService.positionsControllerFindAllInDepartmentName(
        currentDepartmentName,
        1000,
      ),
    enabled: !!currentDepartmentName,
  });

  // If loading, wait to render
  if (loadingUserData) {
    return <div>Loading...</div>;
  }

  // when button is submitted to finalize department and position, register employee
  // with current position and department and route to home page
  const clickResponse = () => {
    if (!currentDepartmentName || !currentPositionName) {
      return;
    }

    // complete registration
    completeRegistration(
      userData.email,
      userData.password,
      currentPositionName,
      currentDepartmentName,
    );
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
          placeholder="Select Department"
          onChange={(e) => setCurrentDepartmentName(e.target.value)}
        >
          {departmentsData?.map(
            (department: DepartmentEntity, index: number) => {
              return (
                <option
                  key={index}
                  value={department.name}
                  selected={department.name === currentDepartmentName}
                >
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
          placeholder={'Select Position'}
          onChange={(e) => setCurrentPositionName(e.target.value)}
          disabled={!currentDepartmentName}
        >
          {positionsData?.map((position: PositionEntity, index: number) => {
            return (
              <option
                key={index}
                value={position.name}
                selected={position.name === currentPositionName}
              >
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
        disabled={!(currentDepartmentName && currentPositionName)}
      >
        Submit
      </Button>
    </>
  );
}
