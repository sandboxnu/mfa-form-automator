import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { AssignGroupsBox } from '@web/components/createFormInstance/AssignGroupsBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Error from '@web/components/Error';
import { useRouterContext } from '@web/context/RouterProvider';

function AssignGroups() {
  const {
    formInstanceName,
    formInstanceDescription,
    formTemplate,
    assignedGroupData,
    setAssignedGroupData,
  } = useCreateFormInstance();

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { isRouteChanging } = useRouterContext();
  const router = useRouter();

  useEffect(() => {
    fetchPdfFile(setPdfFile, formTemplate?.formDocLink);
  }, [formTemplate?.formDocLink]);

  if (!formTemplate) {
    return <Error></Error>;
  }

  return (
    <FormLayout
      type={FormInteractionType.CreateFormInstance}
      pageNumber={3}
      heading={'Create form instance'}
      subheading={
        'Assign your input field groups to a person, role, or department'
      }
      boxContent={
        <AssignGroupsBox
          pdfFile={pdfFile}
          name={formInstanceName ?? ''}
          description={formInstanceDescription ?? ''}
          fieldGroups={formTemplate?.fieldGroups ?? []}
          assignedGroupData={assignedGroupData}
          setAssignedGroupData={setAssignedGroupData}
          formTemplate={formTemplate}
        />
      }
      submitFunction={() => {
        router.push('/form-instance/create/review');
      }}
      backLink={'/form-instance/create/description'}
      disabled={isRouteChanging}
      loading={isRouteChanging}
    />
  );
}

export default isAuth(AssignGroups);
