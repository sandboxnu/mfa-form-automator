import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { UploadBox } from '@web/components/createFormTemplate/UploadBox';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Upload() {
  const { pdfFile, setPdfFile } = useCreateFormTemplate();

  return (
    <FormTemplateLayout
      pageNumber={1}
      subheading={'Upload your form PDF'}
      boxContent={
        <UploadBox
          pdfFile={pdfFile}
          clearPdfFile={() => setPdfFile(null)}
          setPdfFile={setPdfFile}
        />
      }
      deleteFunction={() => setPdfFile(null)}
      submitLink={'/create-template/description'}
      backLink={'/'}
      disabled={!pdfFile}
    />
  );
}
