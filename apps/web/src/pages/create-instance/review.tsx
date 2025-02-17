import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { ReviewBox } from '@web/components/createFormInstance/ReviewBox';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';


export default function Review() {

    const { formInstanceName, formInstanceDescription, formTemplate } = useCreateFormInstance();


    return (
        <CreateFormLayout
            isFormTemplate={false}
            pageNumber={4}
            heading={'Create form instance'}
            subheading={'Review your form instance'}
            boxContent={<ReviewBox
                formLink={formTemplate?.formDocLink || ''}
                name={formInstanceName ?? ''}
                description={formInstanceDescription ?? ''}
            />}
            deleteFunction={() => {}}
            submitLink={'/create-instance/success'}
            backLink={'/create-instance/description'}
            review={true}
            disabled={false}
        />
    );
}