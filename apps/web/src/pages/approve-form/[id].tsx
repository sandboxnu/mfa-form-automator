import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/approveFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useApproveFormInstance } from '@web/hooks/useApproveFormInstance';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useEffect, useState } from 'react';
import Error from '@web/components/Error';

function ReviewAndApproveForm() {
  const { formInstance, completedPdfLink } = useApproveFormInstance();
  const [completedPdfFile, setCompletedPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPdfFile(setCompletedPdfFile, completedPdfLink);
  }, [completedPdfLink]);
  if (!formInstance) {
    return <Error></Error>;
  }
  return (
    <FormLayout
      type={FormInteractionType.ApproveFormInstance}
      pageNumber={1}
      heading={'Review signed instance'}
      subheading={'Review and Approve the completed form'}
      boxContent={
        <ReviewBox
          dimensions={{
            width: formInstance?.formTemplate.pageWidth,
            height: formInstance?.formTemplate.pageHeight,
          }}
          pdfFile={completedPdfFile}
          fieldGroups={[]}
          name={formInstance?.name ?? ''}
          description={formInstance?.description ?? ''}
        />
      }
      submitLink={'/approve-instance/success'}
      backLink={'/pending'}
      review={true}
      disabled={false}
    />
  );
}

export default isAuth(ReviewAndApproveForm);
