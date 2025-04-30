import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/approveFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useApproveFormInstance } from '@web/hooks/useApproveFormInstance';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useEffect, useState } from 'react';

function ReviewAndApproveForm() {
  const { formInstance, completedPdfLink } = useApproveFormInstance();
  const [completedPdfFile, setCompletedPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPdfFile(setCompletedPdfFile, completedPdfLink);
  }, [completedPdfLink]);
  return (
    <FormLayout
      type={FormInteractionType.ApproveFormInstance}
      pageNumber={0}
      heading={'Review signed instance'}
      subheading={'Review and Approve the completed form'}
      boxContent={
        <ReviewBox
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
