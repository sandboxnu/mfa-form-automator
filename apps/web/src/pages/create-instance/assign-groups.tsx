import { Text } from '@chakra-ui/react';    
import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';


export default function AssignGroups() {
  
    return (
        <CreateFormLayout
            isFormTemplate={false}
            pageNumber={3}
            heading={'Create form instance'}
            subheading={'Assign your input field groups to a person, role, or department'} 
            boxContent={<AssignGroups />} 
            deleteFunction={() => {}}
            submitLink={'/create-instance/review'} 
            backLink={'/create-instance/description'} 
            disabled={false}        
            />
    );
}