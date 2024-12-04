import { CreateFormLayout } from '@web/components/createFormLayout/CreateFormLayout';

/**
 * The select template page in the form creation flow, where users select a template.
 */
export default function SelectTemplate() {
  return (
    <CreateFormLayout
      pageNumber={1}
      subheading={'Select a template to start from'}
      deleteFunction={() => {}}
      submitLink={'/create-template/description'}
      backLink={'/'}
      disabled={false}
    >
      <div>Template selection goes here</div>
    </CreateFormLayout>
  );
}
