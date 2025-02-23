import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { AssignGroupsBox } from '@web/components/createFormInstance/AssignGroupsBox';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';


export default function AssignGroups() {

    const { formInstanceName, formInstanceDescription, formTemplate } = useCreateFormInstance();

    return (
        <CreateFormLayout
            isFormTemplate={false}
            pageNumber={3}
            heading={'Create form instance'}
            subheading={'Assign your input field groups to a person, role, or department'}
            boxContent={<AssignGroupsBox
                formLink={formTemplate?.formDocLink || ''}
                name={formInstanceName ?? ''}
                description={formInstanceDescription ?? ''}
                fieldGroups={formTemplate?.fieldGroups ?? []}
            />}
            deleteFunction={() => { }}
            submitLink={'/create-instance/review'}
            backLink={'/create-instance/description'}
            disabled={false}
        />
    );
}