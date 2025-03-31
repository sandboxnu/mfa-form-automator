import { Box } from '@chakra-ui/react';
import { Scope } from '@web/client';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import { ReviewBox } from '@web/components/createFormTemplate/ReviewBox';
import isAuth from '@web/components/isAuth';
import { useCreateFormTemplate } from '@web/context/CreateFormTemplateContext';
import { useSignFormInstance } from '@web/hooks/useSignFormInstance';
import { useRouter } from 'next/router';

/**
 * The upload page in the form template creation flow, where users add their pdf.
 */
function Review() {
  const { formTemplateName, pdfLink } = useSignFormInstance();
  const router = useRouter();

  const { id } = router.query;

  return (
    <FormLayout
      type={FormInteractionType.SignFormInstance}
      pageNumber={4}
      heading={'Create form template'}
      subheading={'Review your form template'}
      boxContent={
        <Box width="100%" height={'400px'}>
          <embed height={800} width={1000} src={pdfLink}></embed>
        </Box>
      }
      deleteFunction={() => {}}
      submitLink={'/create-template/success'}
      backLink={`/form-instances/${id}`}
      disabled={false}
      review={true}
    />
  );
}

export default isAuth(Review, [Scope.ADMIN]);
