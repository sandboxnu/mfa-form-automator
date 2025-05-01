import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { AssignGroupsBox } from '@web/components/createFormInstance/AssignGroupsBox';
import isAuth from '@web/components/isAuth';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useRouter } from 'next/router';
import Error from '@web/components/Error';
import { useRouterContext } from '@web/context/RouterProvider';

function AssignGroups() {
  const {
    formInstanceName,
    formInstanceDescription,
    formTemplate,
    formInstanceUseId,
    assignedGroupData,
    setAssignedGroupData,
    pdfFile,
  } = useEditFormInstance();
  const { isRouteChanging } = useRouterContext();

  const router = useRouter();
  if (!formTemplate) {
    return <Error secondaryErrorMessage="Error editing instance" />;
  }

  return (
    <FormLayout
      type={FormInteractionType.EditFormInstance}
      pageNumber={3}
      heading={'Edit form instance'}
      subheading={
        'Assign your input field groups to a person, role, or department'
      }
      boxContent={
        <AssignGroupsBox
          assignedGroupData={assignedGroupData}
          setAssignedGroupData={setAssignedGroupData}
          formTemplate={formTemplate}
          pdfFile={pdfFile}
          name={formInstanceName ?? ''}
          description={formInstanceDescription ?? ''}
          fieldGroups={formTemplate?.fieldGroups ?? []}
        />
      }
      submitFunction={() => {
        router.push('/form-instance/' + formInstanceUseId + '/edit/review');
      }}
      backLink={'/form-instance/' + formInstanceUseId + '/edit/description'}
      disabled={
        formTemplate?.fieldGroups.length !== assignedGroupData.length ||
        isRouteChanging
      }
      loading={isRouteChanging}
    />
  );
}

export default isAuth(AssignGroups);
