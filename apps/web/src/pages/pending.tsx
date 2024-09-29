import { FormList } from 'apps/web/src/components/FormList';
import { useForm } from '@web/hooks/useForm';

export default function Pending() {
  const { pendingForms } = useForm();

  return (
    <>
      <FormList
        title={'Pending'}
        formInstances={pendingForms}
        color={'#FFECCC'}
        extended={true}
        link={'/'}
        border={true}
      ></FormList>
    </>
  );
}
