import { Scope } from '@web/client';
import { SuccessPage } from '@web/components/createForm/SuccessPage';
import isAuth from '@web/components/isAuth';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { useRouter } from 'next/router';

function Success() {
  const router = useRouter();
  const { formTemplateUseId } = useCreateFormTemplate();

  return (
    <SuccessPage
      message={'Your form template has been updated!'}
      linkText={'Create form instance'}
      linkAction={() => router.push('/form-instance/create/select-template')}
    />
  );
}

export default isAuth(Success, [Scope.ADMIN, Scope.CONTRIBUTOR]);
