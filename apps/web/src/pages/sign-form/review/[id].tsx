import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/signFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useSignFormInstance } from '@web/hooks/useSignFormInstance';
import { useRouter } from 'next/router';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Review() {
  const { formInstance, modifiedPdfLink } = useSignFormInstance();
  const router = useRouter();

  const { id } = router.query;

  return (
    <FormLayout
      type={FormInteractionType.SignFormInstance}
      pageNumber={2}
      heading={'Sign form'}
      subheading={'Review your form submission'}
      boxContent={
        <ReviewBox
          formLink={modifiedPdfLink ?? ''}
          name={formInstance?.name ?? ''}
          description={formInstance?.description ?? ''}
        />
      }
      deleteFunction={() => {}}
      submitLink={'/sign-form/success'}
      backLink={`/sign-form/${id}`}
      disabled={false}
      review={true}
    />
  );
}

export default isAuth(Review);
