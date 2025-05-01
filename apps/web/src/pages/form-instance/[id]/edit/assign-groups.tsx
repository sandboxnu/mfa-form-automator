import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { AssignGroupsBox } from '@web/components/createFormInstance/AssignGroupsBox';
import isAuth from '@web/components/isAuth';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { useRouter } from 'next/router';
import Error from '@web/components/Error';
import { useRouterContext } from '@web/context/RouterProvider';
import { useAuth } from '@web/hooks/useAuth';
import { Scope } from '@web/client';
import EditGuard from './EditGuard';

function AssignGroups() {
  const {
    formInstanceName,
    formInstanceDescription,
    formInstanceData,
    formTemplate,
    assignedGroupData,
    setAssignedGroupData,
    pdfFile,
  } = useEditFormInstance();
  const { isRouteChanging } = useRouterContext();
  const { user } = useAuth();

  const router = useRouter();
  if (!formTemplate) {
    return <Error secondaryErrorMessage="Error editing instance" />;
  }

  if (!user || !formInstanceData) {
    return <></>;
  }

  return (
    <EditGuard formInstanceData={formInstanceData} user={user}>
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
          router.push('/form-instance/' + formInstanceData.id + '/edit/review');
        }}
        backLink={'/form-instance/' + formInstanceData.id + '/edit/description'}
        disabled={
          formTemplate?.fieldGroups.length !== assignedGroupData.length ||
          isRouteChanging
        }
        loading={isRouteChanging}
      />
    </EditGuard>
  );
}

export default isAuth(AssignGroups);
