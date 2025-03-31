import { Scope } from '@web/client/types.gen';
import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { ReviewBox } from '@web/components/createFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

function Review() {
  const { formInstanceName, formInstanceDescription, formTemplate } =
    useCreateFormInstance();

  return (
    <CreateFormLayout
      isFormTemplate={false}
      pageNumber={4}
      heading={'Create form instance'}
      subheading={'Review your form instance'}
      boxContent={
        <ReviewBox
          formLink={formTemplate?.formDocLink || ''}
          name={formInstanceName ?? ''}
          description={formInstanceDescription ?? ''}
        />
      }
      deleteFunction={() => {}}
      submitLink={'/create-instance/success'}
      backLink={'/create-instance/assign-groups'}
      review={true}
      disabled={false}
    />
  );
}

export default isAuth(Review);
