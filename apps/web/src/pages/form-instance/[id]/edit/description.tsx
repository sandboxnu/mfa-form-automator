import { FormLayout } from '@web/components/createForm/FormLayout';
import { NameAndDescriptionBox } from '@web/components/createForm/NameAndDescriptionBox';
import { FormInteractionType } from '@web/components/createForm/types';
import isAuth from '@web/components/isAuth';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useRouter } from 'next/router';
import Error from '@web/components/Error';
import FormLoading from '@web/components/FormLoading';
import { useRouterContext } from '@web/context/RouterProvider';
import EditGuard from './EditGuard';
import { useAuth } from '@web/hooks/useAuth';

/**
 * The description page in the form instance creation flow, where users describe their form.
 */
function Description() {
  const {
    formInstanceName,
    formInstanceDescription,
    formInstanceData,
    setFormInstanceName,
    setFormInstanceDescription,
    pdfFile,
    formTemplate,
    isLoading,
  } = useEditFormInstance();
  const { isRouteChanging } = useRouterContext();
  const { user } = useAuth();

  const router = useRouter();

  if (isLoading) {
    return <FormLoading />;
  }

  if (!formTemplate) {
    return <Error secondaryErrorMessage="Form template not found" />;
  }

  if (!user || !formInstanceData) {
    return <>hi</>;
  }
  return (
    <EditGuard formInstanceData={formInstanceData} user={user}>
      <FormLayout
        type={FormInteractionType.EditFormInstance}
        pageNumber={2}
        heading={'Edit form instance'}
        subheading={'Edit your form instance name and description'}
        boxContent={
          <NameAndDescriptionBox
            pdfFile={pdfFile}
            fieldGroups={[]}
            name={formInstanceName}
            description={formInstanceDescription}
            setName={setFormInstanceName}
            setDescription={setFormInstanceDescription}
            formDimensions={{
              width: formTemplate?.pageWidth ?? 0,
              height: formTemplate?.pageHeight ?? 0,
            }}
          />
        }
        submitFunction={() => {
          router.push(
            '/form-instance/' + formInstanceData.id + '/edit/assign-groups',
          );
        }}
        backLink={'/form-instance/' + formInstanceData.id + '/edit/success'}
        disabled={!formInstanceName || isRouteChanging}
        loading={isRouteChanging}
      />
    </EditGuard>
  );
}

export default isAuth(Description);
