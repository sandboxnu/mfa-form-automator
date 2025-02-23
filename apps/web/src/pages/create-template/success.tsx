import { SuccessPage } from '@web/components/createForm/SuccessPage';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();

  return (
    <SuccessPage
      message={'Your form template has been created!'}
      linkText={'Create form instance'}
      linkAction={() => router.push('/create-instance/select-template')}
    />
  );
}
