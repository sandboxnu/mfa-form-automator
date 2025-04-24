import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { UploadBox } from '@web/components/createFormTemplate/UploadBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { useRouter } from 'next/router';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Upload() {
  const { pdfFile, setPdfFile } = useCreateFormTemplate();
  const router = useRouter();

  return (
    <FormLayout
      type={FormInteractionType.CreateFormTemplate}
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
      submitFunction={() => {
        router.push('/form-template/create/description');
      }}
      backLink={'/'}
      review={false}
      disabled={!pdfFile}
    />
  );
}

export default isAuth(Upload, [Scope.ADMIN, Scope.CONTRIBUTOR]);
