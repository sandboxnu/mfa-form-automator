import { FormList } from 'apps/web/src/components/FormList';
import { useForm } from '@web/hooks/useForm';

export default function Completed() {
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
