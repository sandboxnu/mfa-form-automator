import { Scope } from '@web/client/types.gen';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

function Review() {
  const { formInstanceName, formInstanceDescription, formTemplate } =
    useCreateFormInstance();

  return (
    <FormLayout
      type={FormInteractionType.CreateFormInstance}
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
