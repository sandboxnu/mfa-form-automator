import { UploadBox } from '@web/components/createFormTemplate/UploadBox';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { CreateFormLayout } from '@web/components/createFormLayout/CreateFormLayout';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Upload() {
  const { useBlob } = useCreateFormTemplate();
  const { hasLocalBlob, clearLocalBlob, localBlobData, uploadLocalFile } =
    useBlob;

  return (
    <CreateFormLayout
      pageNumber={1}
      subheading={'Upload your form PDF'}
      deleteFunction={clearLocalBlob}
      submitLink={'/create-template/description'}
      backLink={'/'}
      disabled={!hasLocalBlob}
    >
      <UploadBox
        hasLocalBlob={hasLocalBlob}
        localBlobData={localBlobData}
        clearLocalBlob={clearLocalBlob}
        uploadLocalFile={uploadLocalFile}
      />
    </CreateFormLayout>
  );
}
