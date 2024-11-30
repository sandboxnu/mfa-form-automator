import { useBlob } from '@web/hooks/useBlob';
import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { UploadBox } from '@web/components/createFormTemplate/UploadBox';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Upload() {
  const blob = useBlob();
  return (
    <FormTemplateLayout
      pageNumber={1}
      subheading={'Upload your form PDF'}
      boxContent={<UploadBox blob={blob} />}
      deleteFunction={blob.clearLocalBlob}
      submitLink={'/description'}
      backLink={'/'}
      disabled={!blob.hasLocalBlob}
    />
  );
}
