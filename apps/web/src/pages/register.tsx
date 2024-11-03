import { Button, Flex } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { DepartmentsService, PositionsService } from '@web/client';
import { DepartmentEntity } from '@web/client';
import { PositionEntity } from '@web/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@web/hooks/useAuth';

export default function Register(
  userData: any,
  email: string,
  password: string,
  departmentName: any,
  positionName: any,
) {
  const [positions, setPositions] = useState<PositionEntity[]>([]);
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDepartment, setCurrentDepartment] = useState(departmentName);
  const [currentPosition, setCurrentPosition] = useState(positionName);
  const router = useRouter();
  const { completeRegistration } = useAuth();

  // fetch list of all positions
  useEffect(() => {
    async function fetchPositions() {
      setIsLoading(true);
      try {
        const request: PositionEntity[] =
          await PositionsService.positionsControllerFindAll(1000);
        setPositions(request);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPositions();
  }, []);

  // fetch list of all departments
  useEffect(() => {
    async function fetchDepartments() {
      setIsLoading(true);
      try {
        const request: DepartmentEntity[] =
          await DepartmentsService.departmentsControllerFindAll(1000);
        setDepartments(request);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
        console.log(departments);
      }
    }
    fetchDepartments();
  }, []);

  // If loading, wait to render
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // when button is submitted to finalize department and position,
  // register employee with current position and department
  // and route to home page
  const clickResponse = () => {
    // complete registration
    completeRegistration(
      userData,
      email,
      password,
      currentDepartment,
      currentPosition,
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
          defaultValue={departmentName ? departmentName : 'Select Department'}
          disabled={departmentName}
          onChange={(e) => setCurrentDepartment(e.target.value)}
        >
          {departments.map((department: DepartmentEntity, index: number) => {
            return (
              <option key={index} value={department.name}>
                {department.name}
              </option>
            );
          })}
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
          defaultValue={positionName ? positionName : 'Select Position'}
          disabled={positionName}
          onChange={(e) => setCurrentPosition(e.target.value)}
        >
          {positions.map((position: PositionEntity, index: number) => {
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
