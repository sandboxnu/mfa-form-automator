import { Box } from '@chakra-ui/react';
import { FieldType } from '@web/components/createFormTemplate/types';
import { FormLayout } from '@web/components/createForm/FormLayout';
import { FormInteractionType } from '@web/components/createForm/types';
import FormLoading from '@web/components/FormLoading';
import isAuth from '@web/components/isAuth';
import EditableFieldFactory from '@web/components/signFormInstance/EditableFieldFactory';
import { PDFDisplayed } from '@web/components/signFormInstance/PDFDisplayed';
import { useSignFormInstance } from '@web/hooks/useSignFormInstance';
import { useRouter } from 'next/router';
import ErrorComponent from '../../components/Error';
import { Scope } from '@web/client';

export function SignFormPage() {
  const groupColors = [
    ['#1367EA', '#EEF5FF'],
    ['#BD21CA', '#FDEAFF'],
    ['#7645E8', '#ECE4FF'],
    ['#567E26', '#EDFFD6'],
    ['#A16308', '#FFFDDB'],
  ];
  const router = useRouter();
  const { id } = router.query;

  const { formInstance, isLoading, formInstanceError, fields, groupNumber } =
    useSignFormInstance();

  const FieldBoxes = fields.map((page) => {
    return page.map((templateBox) => {
      return (
        <EditableFieldFactory
          data={templateBox.data}
          pageNum={templateBox.page}
          id={templateBox.id}
          key={templateBox.id}
          type={templateBox.type as FieldType}
          currentPosition={{
            x: templateBox.x_coordinate,
            y: templateBox.y_coordinate,
            width: templateBox.width,
            height: templateBox.height,
          }}
          highlighted={false}
          color={groupColors[groupNumber][1]}
        />
      );
    });
  });

  if (isLoading) {
    return <FormLoading />;
  }
  return (
    <>
      {formInstance && !formInstanceError ? (
        <FormLayout
          pageNumber={1}
          type={FormInteractionType.SignFormInstance}
          heading={'Sign MFA Oracle Logon Request Form'}
          subheading={'Click the highlighted spaces to sign the form'}
          boxContent={
            <Box width="100%">
              <PDFDisplayed
                formFields={FieldBoxes ?? []}
                pdfLink={formInstance.formDocLink}
                formTemplateName={formInstance.formTemplate.name}
              />
            </Box>
          }
          submitLink={`/sign-form/review/${id}`}
          backLink={'/'}
          deleteFunction={() => {}}
          disabled={false}
        />
      ) : formInstanceError?.message ===
        'Request failed with status code 401' ? (
        <ErrorComponent primaryErrorMessage="User is not authorized to access this form instance" />
      ) : (
        <ErrorComponent />
      )}
    </>
  );
}

export default isAuth(SignFormPage, [Scope.CONTRIBUTOR, Scope.ADMIN]);
