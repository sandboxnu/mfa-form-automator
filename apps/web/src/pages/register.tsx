import { Button, Flex } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { DepartmentsService, PositionsService } from '@web/client';
import { DepartmentEntity } from '@web/client';
import { PositionEntity } from '@web/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@web/hooks/useAuth';

export default function Register() {
  // setup
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { completeRegistration } = useAuth();
  // the department and position associated currently with the user's account
  const authPosition = useAuth().position;
  const authDept = useAuth().department;
  // the lists of all possible positions and departments in the mfa
  const [positions, setPositions] = useState<PositionEntity[]>([]);
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  // whether the page is loading
  // the currently selected position and department for this page, which will eventually
  // be set to associate their account with
  const [currentDepartment, setCurrentDepartment] = useState(authDept);
  const [currentPosition, setCurrentPosition] = useState(authPosition);

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
  }, [positions]);

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
  }, [departments]);

  // If loading, wait to render
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // when button is submitted to finalize department and position, register employee
  // with current position and department and route to home page
  const clickResponse = () => {
    // complete registration
    completeRegistration(currentDepartment, currentPosition);
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
            authDept != null ? authDept.toString() : 'Select Department'
          }
          disabled={authDept != null}
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
          placeholder={
            authPosition != null ? authPosition.toString() : 'Select Position'
          }
          disabled={authPosition != null}
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
