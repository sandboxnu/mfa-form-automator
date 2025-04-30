import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/approveFormInstance/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useApproveFormInstance } from '@web/hooks/useApproveFormInstance';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useEffect, useState } from 'react';

function ReviewAndApproveForm() {
  const { formInstance, modifiedPdfLink, originalPdfLink } =
    useApproveFormInstance();
  const [modifiedPdfFile, setModifiedPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPdfFile(setModifiedPdfFile, modifiedPdfLink);
  }, [modifiedPdfLink]);
  return (
    <FormLayout
      type={FormInteractionType.EditFormInstance}
      pageNumber={4}
      heading={'Review signed instance'}
      subheading={'Review Approve the completed form'}
      boxContent={
        <ReviewBox
          pdfFile={modifiedPdfFile}
          fieldGroups={[]}
          name={formInstance?.name ?? ''}
          description={formInstance?.description ?? ''}
        />
      }
      submitLink={'/create-instance/success'}
      backLink={'/create-instance/assign-groups'}
      review={true}
      disabled={false}
    />
  );
}

export default isAuth(ReviewAndApproveForm);
