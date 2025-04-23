import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';

function Review() {
  const {
    formInstanceName,
    formInstanceDescription,
    formTemplate,
    formInstanceUseId,
    pdfFile,
  } = useCreateFormInstance();

  return (
    <FormLayout
      type={FormInteractionType.EditFormInstance}
      pageNumber={4}
      heading={'Edit form instance'}
      subheading={'Review your form instance'}
      boxContent={
        <ReviewBox
          pdfFile={pdfFile}
          name={formInstanceName ?? ''}
          description={formInstanceDescription ?? ''}
          fieldGroups={formTemplate?.fieldGroups ?? []}
        />
      }
      deleteFunction={() => {}}
      submitLink={'/form-instance/[id]/edit/success'}
      backLink={'/form-instance/[id]/edit/assign-groups'}
      review={true}
      disabled={false}
    />
  );
}

export default isAuth(Review);
