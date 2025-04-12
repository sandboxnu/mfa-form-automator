import { useMutation, useQuery } from '@tanstack/react-query';
import {
  formInstancesControllerFindOneOptions,
  formInstancesControllerSignFormInstanceMutation,
} from '@web/client/@tanstack/react-query.gen';
import { FormField, SignFormInstanceContextType } from '@web/context/types';
import { useAuth } from '@web/hooks/useAuth';
import { useRouter } from 'next/router';
import { PDFCheckBox, PDFDocument, PDFTextField } from 'pdf-lib';
import React, { createContext, useEffect, useState } from 'react';

export const SignFormInstanceContext =
  createContext<SignFormInstanceContextType>({} as SignFormInstanceContextType);

export const SignFormInstanceContextProvider = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const {
    data: formInstance,
    error: formInstanceError,
    isLoading,
  } = useQuery({
    ...formInstancesControllerFindOneOptions({
      path: {
        id: id,
      },
    }),
    enabled: !!id,
    retry: (failureCount, error) => {
      if (error.message === 'Request failed with status code 401') {
        return false; // Do not retry on 401 errors
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });
  const [signFormInstanceLoading, setSignFormInstanceLoading] = useState(false);
  const [fields, setFields] = useState<FormField[][]>([]);
  const [groupNumber, setGroupNumber] = useState<number>(0);
  const [modifiedPdfLink, setModifiedPdfLink] = useState('');
  const [originalPdfLink, setOriginalPdfLink] = useState('');
  const [assignedGroupId, setAssignedGroupId] = useState<string>();
  const router = useRouter();
  const signFormInstanceMutation = useMutation({
    ...formInstancesControllerSignFormInstanceMutation(),
  });
  useEffect(() => {
    if (!formInstance || formInstanceError) return;

    const assignedGroups = formInstance?.assignedGroups.filter(
      (assignedGroup) =>
        (assignedGroup.signerDepartmentId === user?.departmentId ||
          assignedGroup.signerEmployeeId === user?.id ||
          assignedGroup.signerPositionId === user?.positionId ||
          assignedGroup.signerEmployeeList
            ?.map((employee) => employee.id)
            .find((id) => id === user?.id)) &&
        assignedGroup.signed == false,
    );
    if (assignedGroups && assignedGroups.length > 0) {
      setGroupNumber(assignedGroups[0]?.order);
      setAssignedGroupId(assignedGroups[0].id);
    }

    const getFields = () => {
      if (assignedGroups.length > 0) {
        const numPages =
          Math.max(
            ...assignedGroups.flatMap((group) =>
              group.fieldGroup.templateBoxes.map((box) => box.page),
            ),
          ) + 1;
        const fields: FormField[][] = Array.from(
          { length: numPages },
          () => [],
        );

        assignedGroups[0].fieldGroup.templateBoxes.forEach((templateBox) => {
          if (templateBox.type === 'TEXT_FIELD') {
            fields[templateBox.page].push({
              ...templateBox,
              data: {
                text: '',
              },
            });
          } else {
            fields[templateBox.page].push({
              ...templateBox,
              data: {
                filled: false,
              },
            });
          }
        });

        return fields;
      }
    };
    const fields = getFields() ?? [];

    setFields(fields);
    let i = 0;
    let currentFormDocLink = null;
    while (
      i < formInstance.assignedGroups.length &&
      formInstance.assignedGroups[i].signedDocLink != null
    ) {
      currentFormDocLink = formInstance.assignedGroups[i].signedDocLink;
      i++;
    }
    const pdfLink = currentFormDocLink ?? formInstance.formDocLink;
    setOriginalPdfLink(pdfLink);
    setModifiedPdfLink(pdfLink);
  }, [
    formInstance,
    formInstanceError,
    user?.departmentId,
    user?.id,
    user?.positionId,
  ]);

  const updateField = (pageNum: number, id: string, data: boolean | string) => {
    setFields((prevFields) => {
      const updatedFields = [...prevFields];
      const updatedField = updatedFields[pageNum].find(
        (field) => field.id === id,
      );
      if (updatedField) {
        if (typeof data == 'boolean') {
          updatedField.data.filled = data;
        } else {
          updatedField.data.text = data as string;
        }
      }
      return updatedFields;
    });
  };

  const modifyPdf = async (submitLink: string, pdfDoc: PDFDocument) => {
    const form = pdfDoc.getForm();

    for (const [pageNum, formFields] of fields.entries()) {
      const page = pdfDoc.getPage(pageNum);
      const { width: pageWidth, height: pageHeight } = page.getSize();

      for (const field of formFields) {
        const { width, height, x_coordinate: x, y_coordinate: y } = field;
        if (
          formInstance?.formTemplate.pageHeight &&
          formInstance?.formTemplate.pageWidth
        ) {
          const formWidth = formInstance.formTemplate.pageWidth;
          const formHeight = formInstance.formTemplate.pageHeight;

          const widthOnPdf = (width * pageWidth) / formWidth;
          const heightOnPdf = (height * pageHeight) / formHeight;
          const xCoordOnPdf = (x * pageWidth) / formWidth;
          const yCoordOnPdf =
            pageHeight - (y * pageHeight) / formHeight - heightOnPdf;

          let fieldToBeAdded: PDFCheckBox | PDFTextField | undefined;

          switch (field.type) {
            case 'SIGNATURE':
              if (user?.signatureLink && field.data.filled) {
                const signatureImageBytes = await fetch(
                  user.signatureLink,
                ).then((res) => res.arrayBuffer());
                const pngImage = await pdfDoc.embedPng(signatureImageBytes);
                page.drawImage(pngImage, {
                  x: xCoordOnPdf,
                  y: yCoordOnPdf,
                  width: widthOnPdf,
                  height: heightOnPdf,
                });
              }
              break;
            case 'CHECKBOX':
              fieldToBeAdded = form.createCheckBox(field.id);
              fieldToBeAdded.addToPage(page, {
                width: widthOnPdf,
                height: heightOnPdf,
                x: xCoordOnPdf,
                y: yCoordOnPdf,
              });
              if (field.data.filled) {
                fieldToBeAdded.check();
              }
              break;
            case 'TEXT_FIELD':
              fieldToBeAdded = form.createTextField(field.id);
              fieldToBeAdded.setText(field.data.text);
              fieldToBeAdded.addToPage(page, {
                width: widthOnPdf,
                height: heightOnPdf,
                x: xCoordOnPdf,
                y: yCoordOnPdf,
              });
              break;
          }
        }
      }
    }

    form.getFields().forEach((fieldOnForm) => {
      fieldOnForm.enableReadOnly();
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setModifiedPdfLink(url);
    router.push(submitLink);
  };

  const submitPdf = async (submitLink: string, pdfDoc: PDFDocument) => {
    const form = pdfDoc.getForm();
    form.getFields().forEach((fieldOnForm) => {
      fieldOnForm.disableReadOnly();
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    if (assignedGroupId && blob && formInstance) {
      const res = await signFormInstanceMutation.mutateAsync({
        body: {
          file: blob,
          assignedGroupId,
        },
        path: {
          formInstanceId: formInstance?.id,
        },
      });
      if (res) {
        router.push(submitLink);
      }
    }
  };

  const nextSignFormPage = async (
    submitLink: string,
    isReviewPage: boolean,
  ) => {
    const existingPdfBytes = !isReviewPage
      ? await fetch(originalPdfLink).then((res) => res.arrayBuffer())
      : await fetch(modifiedPdfLink).then((res) => res.arrayBuffer());

    if (existingPdfBytes) {
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      if (!isReviewPage) {
        modifyPdf(submitLink, pdfDoc);
      } else {
        submitPdf(submitLink, pdfDoc);
      }
    }
  };

  return (
    <SignFormInstanceContext.Provider
      value={{
        formInstanceError,
        isLoading,
        originalPdfLink,
        modifiedPdfLink,
        fields,
        formInstance,
        groupNumber,
        nextSignFormPage,
        updateField,
        signFormInstanceLoading,
      }}
    >
      {children}
    </SignFormInstanceContext.Provider>
  );
};
