import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
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
    <CreateFormLayout
      isFormTemplate={true}
      pageNumber={1}
      heading={'Create form template'}
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
