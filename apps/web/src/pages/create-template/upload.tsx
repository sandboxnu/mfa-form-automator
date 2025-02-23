import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { UploadBox } from '@web/components/createFormTemplate/UploadBox';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Upload() {
  const { pdfFile, setPdfFile } = useCreateFormTemplate();

  return (
    <CreateFormLayout
      isFormTemplate={true}
      pageNumber={1}
      heading={'Create form template'}
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
