import { FormList } from 'apps/web/src/components/FormList';
import { useAuth } from './../hooks/useAuth';
import { useForm } from '@web/hooks/useForm';

export default function Completed() {
  useAuth();
  const { completedForms } = useForm();

  return (
    <>
      <FormList
        title={'Completed'}
        formInstances={completedForms}
        color={'#D0F0DC'}
      ></FormList>
    </>
  );
}
