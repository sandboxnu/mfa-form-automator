import { Box, Button, Flex, Text, Icon } from '@chakra-ui/react';
import { LeftArrowIcon } from '@web/static/icons';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DropdownDownArrow, DropdownUpArrow } from 'apps/web/src/static/icons';
import { Select, chakraComponents } from 'chakra-react-select';
import {
  QueryClientProvider,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { EmployeesService, FormTemplatesService } from '@web/client';
import { PositionsService } from '@web/client';
// take docker out of readme
// TODO
// make outline not blue when dropdown is clicked
// search directory in assignees and icon?
// set default width of assignee dropdowns to be wider
// more margin w search
// save form instead of submit form
// modal
// get rid of back to overview
// endpoint to get all templates
// get all positions for assignees
// end point to create new form instanc e
// check api spec
// click outside
// make form name editable
interface FormData {
  id: string;
  name: string;
}
interface EmployeeData {
  id: string;
  firstName: string;
  lastName: string;
}

const employee: EmployeeData = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  // Other properties
};
interface Option {
  value: string;
  label: string;
}
interface OptionLabel {
  value: string;
  label: string;
}

const API_FORM_INSTANCES = '/api/form-instances?limit=100';
const API_EMPLOYEES = '/api/employees?limit=100';

const CreateForm = () => {
  const queryClient = useQueryClient();
  const [formOptions, setFormOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedForm, setSelectedForm] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [isFormTypeDropdownOpen, setIsFormTypeDropdownOpen] = useState(false);
  const [isLeadershipDropdownOpen, setIsLeadershipDropdownOpen] =
    useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] =
    useState(false);
  const [assigneeOptions, setAssigneeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedAssignee, setSelectedAssignee] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedDepartmentHead, setSelectedDepartmentHead] = useState<{
    value: string;
    label: string;
  } | null>(null);

  // Fetch form templates data
  const { data: formTemplates, error: formTemplatesError } = useQuery({
    queryKey: ['http://localhost:8080/api/form-templates'],
    queryFn: () => FormTemplatesService.formTemplatesControllerFindAll(),
  });

  // Fetch form templates data
  const { data: employees, error: employeesError } = useQuery({
    queryKey: ['http://localhost:8080/api/employees'],
    queryFn: () => EmployeesService.employeesControllerFindAll(),
  });

  useEffect(() => {
    if (formTemplates) {
      // Map formTemplates data to the required format
      const templatesOptions = formTemplates.map((template) => ({
        value: template.id,
        label: template.name,
      }));
      setFormOptions(templatesOptions); // Update formOptions with the mapped data
    }

    if (employees) {
      // Map employees data to include both employee name and position name
      const employeesOptions = employees.map((employee) => ({
        value: `${employee.firstName} ${employee.lastName}`,
        label: `| ${employee.position.name}`,
      }));
      setAssigneeOptions(employeesOptions); // Update assigneeOptions with the mapped data
    }
  }, [formTemplates, employees]);

  // useEffect(() => {
  //   if (positions) {
  //     const positionsOptions = positions.map((position) => ({
  //       value: position.id, // You can use the ID or another unique identifier
  //       label: position.name, // Use the name as the label
  //     }));
  //     setAssigneeOptions(positionsOptions);
  //   }
  // }, [positions]);

  // Check the results
  if (formTemplates) {
    // Data has been successfully fetched for formTemplates
    console.log('Form Templates Data:', formTemplates);
  } else if (formTemplatesError) {
    // An error occurred while fetching formTemplates
    console.error('Form Templates Error:', formTemplatesError);
  }

  // if (employee) {
  //   // Data has been successfully fetched for positions
  //   console.log('Employee Data:', positions);
  // } else if (positionsError) {
  //   // An error occurred while fetching positions
  //   console.error('Positions Error:', positionsError);
  // }

  // Fetch employees data
  //  const { data: employees, error: employeesError } = useQuery(
  //   'employees',
  //   async () => {
  //     const response = await fetch(API_EMPLOYEES);
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.json();
  //   }
  // );
  // Handle the fetched data and update the state
  //  useEffect(() => {
  //   if (formInstances) {
  //     const formOptions = formInstances.map((formInstance) => ({
  //       value: formInstance.name, // Use the name as both value and label
  //       label: formInstance.name,
  //     }));
  //     setFormOptions(formOptions);
  //   }

  //   if (employees) {
  //     const assigneeOptions = employees.map((employee) => ({
  //       value: employee.id,
  //       label: `${employee.firstName} ${employee.lastName}`,
  //     }));
  //     setAssigneeOptions(assigneeOptions);
  //   }
  // }, [formInstances, employees]);

  const formatOptionLabel = ({ value, label }: OptionLabel) => (
    <span>
      <strong>{value}</strong>
      <span style={{ marginLeft: '8px', color: 'gray' }}>{label}</span>
    </span>
  );

  const components = {
    DropdownIndicator: (props: any) => (
      <chakraComponents.DropdownIndicator {...props}>
        <div style={{ marginLeft: '10px' }}>
          <DropdownDownArrow />
        </div>
      </chakraComponents.DropdownIndicator>
    ),
  };

  const handleFormTypeDropdownOpen = () => {
    setIsFormTypeDropdownOpen(true);
    setIsLeadershipDropdownOpen(false);
    setIsDepartmentDropdownOpen(false);
  };

  const handleLeadershipDropdownOpen = () => {
    setIsLeadershipDropdownOpen(true);
    setIsFormTypeDropdownOpen(false);
    setIsDepartmentDropdownOpen(false);
  };

  const handleDepartmentDropdownOpen = () => {
    setIsDepartmentDropdownOpen(true);
    setIsFormTypeDropdownOpen(false);
    setIsLeadershipDropdownOpen(false);
  };

  const handleDropdownClose = () => {
    setIsFormTypeDropdownOpen(false);
    setIsLeadershipDropdownOpen(false);
    setIsDepartmentDropdownOpen(false);
  };

  const FormTypeDropdownIndicator = (props: any) => (
    <chakraComponents.DropdownIndicator {...props}>
      {isFormTypeDropdownOpen ? <DropdownUpArrow /> : <DropdownDownArrow />}
    </chakraComponents.DropdownIndicator>
  );

  const LeadershipDropdownIndicator = (props: any) => (
    <chakraComponents.DropdownIndicator {...props}>
      {isLeadershipDropdownOpen ? <DropdownUpArrow /> : <DropdownDownArrow />}
    </chakraComponents.DropdownIndicator>
  );

  const DepartmentDropdownIndicator = (props: any) => (
    <chakraComponents.DropdownIndicator {...props}>
      {isDepartmentDropdownOpen ? <DropdownUpArrow /> : <DropdownDownArrow />}
    </chakraComponents.DropdownIndicator>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Flex flexDirection="column" marginLeft="49px">
        <Flex alignItems="center" marginTop="42px" marginBottom="22px">
          <Link href="/">
            <Flex alignItems="center">
              <LeftArrowIcon
                width="10px"
                height="10px"
                marginLeft="4px"
                marginRight="4px"
              />
              <Text fontWeight="500" fontSize="16px" color="#4C658A">
                Back to Overview
              </Text>
            </Flex>
          </Link>
        </Flex>
        <Text
          fontWeight="1000"
          fontSize="27px"
          color="black"
          paddingBottom="41px"
        >
          {selectedForm ? selectedForm.label : '[New] Form'}
        </Text>

        <Flex flexDirection="row">
          <Flex flexDirection="column" marginRight="79px">
            <Text fontWeight="700" fontSize="20px" color="black">
              Form Type
            </Text>
            {/* TODO add clear button to reset */}
            <Select
              useBasicStyles
              selectedOptionStyle="check"
              options={formOptions}
              placeholder="Select Form Template"
              value={selectedForm}
              onChange={(value: { value: string; label: string } | null) => {
                // value is the selected option or null
                setSelectedForm(value);
              }}
              className="custom-dropdown"
              components={{ DropdownIndicator: FormTypeDropdownIndicator }}
              onMenuOpen={handleFormTypeDropdownOpen}
              onMenuClose={handleDropdownClose}
              getOptionLabel={(option) => option.label}
              classNamePrefix="react-select"
              isClearable
            />
            <Box
              width="496px"
              height="436px"
              backgroundColor="gray.300"
              marginBottom="10px"
              marginTop="10px"
            >
              {/* Placeholder for PDF */}
            </Box>
          </Flex>

          <Flex flexDirection="column">
            <Text fontWeight="700" fontSize="20px" color="black">
              Assignees
            </Text>
            <Text
              fontWeight="500"
              fontSize="16px"
              color="black"
              marginTop="40px"
            >
              Leadership Team Member
            </Text>
            <Select
              useBasicStyles
              selectedOptionStyle="check"
              options={assigneeOptions}
              placeholder="Select assignee"
              value={selectedAssignee}
              onChange={(value: { value: string; label: string } | null) => {
                // value is the selected option or null
                setSelectedAssignee(value);
              }}
              className="custom-dropdown"
              components={{ DropdownIndicator: LeadershipDropdownIndicator }}
              onMenuOpen={handleLeadershipDropdownOpen}
              onMenuClose={handleDropdownClose}
              getOptionLabel={(option) => option.label}
              formatOptionLabel={formatOptionLabel}
              classNamePrefix="react-select"
              isClearable
            />
            <Text
              fontWeight="500"
              fontSize="16px"
              color="black"
              marginTop="24px"
            >
              Department Head
            </Text>
            <Select
              useBasicStyles
              selectedOptionStyle="check"
              options={assigneeOptions}
              placeholder="Select assignee"
              value={selectedDepartmentHead} // Create a separate state for Department Head
              onChange={(value: { value: string; label: string } | null) => {
                // value is the selected option or null
                setSelectedDepartmentHead(value);
              }}
              className="custom-dropdown"
              components={{ DropdownIndicator: DepartmentDropdownIndicator }}
              onMenuOpen={handleDepartmentDropdownOpen}
              onMenuClose={handleDropdownClose}
              getOptionLabel={(option) => option.label}
              formatOptionLabel={formatOptionLabel}
              classNamePrefix="react-select"
              isClearable
            />
          </Flex>
        </Flex>

        <Link href="/">
          <Button
            backgroundColor="white"
            borderColor="#4C658A"
            border="1px"
            textColor="#4C658A"
            width="114px"
            height="40px"
            position="absolute"
            right="212px"
            bottom="32px"
          >
            Cancel
          </Button>
        </Link>
        <Button
          backgroundColor="#4C658A"
          textColor="white"
          width="161px"
          height="40px"
          position="absolute"
          right="40px"
          bottom="32px"
        >
          Submit Form
        </Button>
      </Flex>
    </QueryClientProvider>
  );
};

export default CreateForm;
