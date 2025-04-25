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
    formInstanceDescription: desc,
    setAssignedGroupData,
    formInstanceUseId,
    setFormInstanceUseId,
    setPdfFile,
    pdfFile: uploaded,
  } = useEditFormInstance();

  const {
    id,
    pdfFile,
    formInstanceName,
    formInstanceDescription,
    formTemplate,
    assignedGroupData
  } = useCreateFormInstance();
  const router = useRouter();
const populateAndReroute = () => {
  
  console.log(id);
  router.push(`/form-instance/${id}/edit/description`);
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
