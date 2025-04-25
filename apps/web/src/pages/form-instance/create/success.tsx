import { Scope } from '@web/client/types.gen';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useCreateFormInstance } from '@web/context/CreateFormInstanceContext';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { useEditFormInstance } from '@web/context/EditFormInstanceContext';
import { fetchPdfFile } from '@web/utils/formInstanceUtils';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Success() {
  const {
    setFormInstanceName,
    setFormInstanceDescription,
    setAssignedGroupData,
    setFormInstanceUseId,
    setFormTemplate,
    formInstanceUseId,
  } = useEditFormInstance();
  const {
    formInstanceName,
    formInstanceDescription,
    assignedGroupData,
    formTemplate,
  } = useCreateFormInstance();
  const router = useRouter();

  useEffect(() => {
    if (router.query.id && typeof router.query.id == 'string') {
      setFormInstanceUseId(router.query.id);
    }
  }, [router.query]);

  const populateAndReroute = () => {
    setFormInstanceName(formInstanceName);
    setFormInstanceDescription(formInstanceDescription);
    setAssignedGroupData(assignedGroupData);
    setFormTemplate(formTemplate);
    router.push(`/form-instance/${formInstanceUseId}/edit/description`);
  };

  return (
    <SuccessPage
      message={'Your form instance has been created!'}
      linkText={'Edit Form'}
      linkAction={populateAndReroute}
    />
  );
}

export default isAuth(Success);
