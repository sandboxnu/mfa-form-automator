import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { UploadBox } from '@web/components/createFormTemplate/UploadBox';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Upload() {
  const { useBlob } = useCreateFormTemplate();
  const { hasLocalBlob, clearLocalBlob, localBlobData, uploadLocalFile } =
    useBlob;

  return (
    <FormTemplateLayout
      pageNumber={1}
      subheading={'Upload your form PDF'}
      boxContent={
        <UploadBox
          hasLocalBlob={hasLocalBlob}
          localBlobData={localBlobData}
          clearLocalBlob={clearLocalBlob}
          uploadLocalFile={uploadLocalFile}
        />
      }
      deleteFunction={clearLocalBlob}
      submitLink={'/create-template/description'}
      backLink={'/'}
      disabled={!hasLocalBlob}
    />
  );
}
