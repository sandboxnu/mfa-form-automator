import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/signFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useSignFormInstance } from '@web/hooks/useSignFormInstance';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import Error from '@web/components/Error';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Review() {
  const {
    formInstance,
    modifiedPdfLink,
    nextSignFormPage,
    signFormInstanceLoading,
  } = useSignFormInstance();
  const router = useRouter();
  const [modifiedPdfFile, setModifiedPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPdfFile(setModifiedPdfFile, modifiedPdfLink);
  }, [modifiedPdfLink]);

  const { id } = router.query;

  if (!formInstance) {
    return <Error></Error>;
  }

  return (
    <FormLayout
      type={FormInteractionType.SignFormInstance}
      pageNumber={2}
      heading={'Sign form'}
      subheading={'Review your form submission'}
      boxContent={
        <ReviewBox
          pdfFile={modifiedPdfFile}
          fieldGroups={[]}
          name={formInstance?.name ?? ''}
          description={formInstance?.description ?? ''}
          dimensions={{
            width: formInstance?.formTemplate.pageWidth,
            height: formInstance?.formTemplate.pageHeight,
          }}
        />
      }
      submitFunction={async () => {
        await nextSignFormPage('/sign-form/success', true);
      }}
      backLink={`/sign-form/${id}`}
      disabled={signFormInstanceLoading}
      loading={signFormInstanceLoading}
      review={true}
    />
  );
}

export default isAuth(Review);
