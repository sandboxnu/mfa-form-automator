import { useQuery } from '@tanstack/react-query';
import { formInstancesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';
import { FieldType } from '@web/components/createFormTemplate/types';
import isAuth from '@web/components/isAuth';
import EditableFieldFactory from '@web/components/signFormInstance/EditableFieldFactory';
import { PDFDisplayed } from '@web/components/signFormInstance/PDFDisplayed';
import { useAuth } from '@web/hooks/useAuth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ErrorComponent from './../../components/Error';
import FormLoading from './../../components/FormLoading';
import { Box } from '@chakra-ui/react';
import { CreateFormLayout } from '@web/components/createForm/CreateFormLayout';
import { SignFormLayout } from '@web/components/signFormInstance/SignFormLayout';

/**
 * @returns a view of a form instance
 */
function FormInstanceView() {
  const groupColors = [
    ['#1367EA', '#EEF5FF'],
    ['#BD21CA', '#FDEAFF'],
    ['#7645E8', '#ECE4FF'],
    ['#567E26', '#EDFFD6'],
    ['#A16308', '#FFFDDB'],
  ];
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery({
    ...formInstancesControllerFindOneOptions({
      path: {
        id: String(id),
      },
    }),
    enabled: !!id,
  });

  const FieldBoxes = formInstance?.assignedGroups.map((assignedGroup) => {
    if (
      assignedGroup.signerDepartmentId == user?.departmentId ||
      assignedGroup.signerEmployeeId == user?.id ||
      assignedGroup.signerPositionId == user?.positionId
    ) {
      return assignedGroup.fieldGroup.templateBoxes.map((templateBox) => {
        return (
          <EditableFieldFactory
            key={templateBox.id}
            type={templateBox.type as FieldType}
            currentPosition={{
              x: templateBox.x_coordinate,
              y: templateBox.y_coordinate,
              width: templateBox.width,
              height: templateBox.height,
            }}
            highlighted={false}
            color={groupColors[assignedGroup.order][1]}
          />
        );
      });
    } else {
      return [];
    }
  });

  if (isLoading) {
    return <FormLoading />;
  }
  return (
    <>
      {formInstance && !formInstanceError ? (
        <SignFormLayout
          heading={'Sign MFA Oracle Logon Request Form'}
          subheading={
            'Click the highlighted spaces to sign the form'
          }
          boxContent={
            <Box width="100%">
              <PDFDisplayed
                formFields={FieldBoxes ?? []}
                pdfLink={formInstance.formDocLink}
                formTemplateName={formInstance.formTemplate.name}
              />
            </Box>
          }
          deleteFunction={() => {}}
          submitLink={''}
          backLink={''}
          disabled={false}
        />
      ) : (
        <ErrorComponent />
      )}
    </>
  );
}
// TODO: This should be restricted
export default isAuth(FormInstanceView, []);
