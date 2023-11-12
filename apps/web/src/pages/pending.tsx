import { FormList } from 'apps/web/src/components/FormList';
import { useAuth } from './../hooks/useAuth';
import { useForm } from '@web/hooks/useForm';

export default function Pending() {
  useAuth();
  const { pendingForms } = useForm();

  return (
    <>
      <FormList
        title={'Pending'}
        formInstances={pendingForms}
        color={'#FFECCC'}
      ></FormList>
    </>
  );
}
