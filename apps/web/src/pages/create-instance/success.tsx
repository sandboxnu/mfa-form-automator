import { SuccessPage } from '@web/components/createForm/SuccessPage';
import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();

  return (
    <SuccessPage
      message={'Your form instance has been created!'}
      linkText={'Edit Form'}
      linkAction={() => router.push('/')}
    />
  );
}
