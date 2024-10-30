import { Button, Flex } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Select } from "@chakra-ui/react";
import { DepartmentsService, PositionsService } from '@web/client';
import { DepartmentEntity } from '@web/client';
import { PositionEntity } from '@web/client';
import FormInstance from '@web/components/FormInstance';
import { useEffect, useState } from 'react';
import { format } from 'util';
import ReactDOMServer from 'react-dom/server';

export default function Register (
    departmentName : any,
    positionName : any
) {
    const [positions, setPositions] = useState<PositionEntity[]>([]);
    const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    let currentDepartment = departmentName;
    let currentPosition = positionName;

    // fetch list of all positions
    useEffect(() => {
        async function fetchPositions() {
            setIsLoading(true);
            try {
                const request:PositionEntity[] = await PositionsService.positionsControllerFindAll(1000);
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
                const request:DepartmentEntity[] = await DepartmentsService.departmentsControllerFindAll(1000);
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

    // Formats the array as a set of option elements with the names of the elements in the array
    // expects elements in the Array have a name property
    function format(arr:Array<any>) {
        return (<>
            {
                arr.map((key, value) => {
                    <option value={value}>{key.name}</option>
                })
            }
        </>)
    }
    
    // If loading, wait to render 
    if(isLoading) {
        return <div>Loading...</div>;
    }

    // Complete submission once user 
    function submit() {
        
    }

    return (<>
        <Heading
            pt="50px"
            as="h2"
            textColor="#363940"
            fontSize="24px"
        >
            Select Department
        </Heading> 
        <Select defaultValue={departmentName ? departmentName : "SelectDepartment"} disabled={departmentName}>
            {
            departments.map((key, value) => {
                return <option value={value}>{key.name}</option>
            })}       
        </Select>
        <Heading
            pt="50px"
            as="h2"
            textColor="#363940"
            fontSize="24px"
        >
            Select Positions
        </Heading> 
        <Select id="positionDropdown" defaultValue={positionName ? positionName : "SelectPosition"} disabled={positionName}>
            {
            positions.map((key, value) => {
                return <option value={value}>{key.name}</option>
            })
            }
        </Select>
        <Button 
            marginTop="20px"
            disabled={!(currentDepartment && currentPosition)}>
            Submit
        </Button>
    </>);
}
