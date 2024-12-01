import { FormTemplateLayout } from '@web/components/createFormTemplate/FormTemplateLayout';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
export default function Review() {
  return (
    <FormTemplateLayout
      pageNumber={4}
      subheading={'Review your form template'}
      boxContent={<ReviewBox formLink={''} />}
      deleteFunction={() => {}}
      submitLink={'/create-template/success'}
      backLink={'/create-template/inputFields'}
      disabled={false}
      review={true}
    />
  );
}
