import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { UploadBox } from '@web/components/createFormTemplate/UploadBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { useRouterContext } from '@web/context/RouterProvider';
import { useRouter } from 'next/router';
import { pdfjs } from 'react-pdf';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Upload() {
  const router = useRouter();
  const { pdfFile, setPdfFile, setFormDimensions } = useCreateFormTemplate();
  const { isRouteChanging } = useRouterContext();

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
          setPdfFile={(file: File) => {
            file
              ?.arrayBuffer()
              .then((arrayBuffer) => {
                return pdfjs.getDocument(arrayBuffer).promise;
              })
              .then((data) => {
                return data.getPage(1);
              })
              .then((page) => {
                const dimensions = page
                  .getViewport({ scale: 1 })
                  .viewBox.map((n) => (n / 72) * 300);
                setFormDimensions({
                  width: dimensions[2],
                  height: dimensions[3],
                });
              })
              .then(() => {
                setPdfFile(file);
              });
          }}
        />
      }
      submitFunction={() => {
        router.push('/form-template/create/description');
      }}
      backLink={'/'}
      review={false}
      disabled={!pdfFile || isRouteChanging}
      loading={isRouteChanging}
    />
  );
}

export default isAuth(Upload, [Scope.ADMIN, Scope.CONTRIBUTOR]);
