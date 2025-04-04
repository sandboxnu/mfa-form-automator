import { useQuery } from '@tanstack/react-query';
import { formInstancesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';
import { FormField, SignFormInstanceContextType } from '@web/context/types';
import { useAuth } from '@web/hooks/useAuth';
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

  const [fields, setFields] = useState<FormField[][]>([]);
  const [groupNumber, setGroupNumber] = useState<number>(0);
  const [pdfLink, setPdfLink] = useState('');
  const [formTemplateName, setFormTemplateName] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob>();
  const [assignedGroupId, setAssignedGroupId] = useState<string>();

  useEffect(() => {
    if (!formInstance || formInstanceError) return;
    const assignedGroups = formInstance?.assignedGroups.filter(
      (assignedGroup) =>
        assignedGroup.signerDepartmentId == user?.departmentId ||
        assignedGroup.signerEmployeeId == user?.id ||
        assignedGroup.signerPositionId == user?.positionId,
    );
    if (assignedGroups && assignedGroups.length === 1) {
      setGroupNumber(assignedGroups[0]?.order);
      setAssignedGroupId(assignedGroups[0].id);
    }

    const getFields = () => {
      const numPages =
        Math.max(
          ...assignedGroups.flatMap((group) =>
            group.fieldGroup.templateBoxes.map((box) => box.page),
          ),
        ) + 1;
      const fields: FormField[][] = Array.from({ length: numPages }, () => []);

      assignedGroups.forEach((assignedGroup) =>
        assignedGroup.fieldGroup.templateBoxes.forEach((templateBox) => {
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
        }),
      );
      return fields;
    };
    const fields = getFields();

    setFields(fields);
    let i = 0;
    let currentFormDocLink = null;
    console.log('Form Instance: ', formInstance);
    while (
      i < formInstance.assignedGroups.length &&
      formInstance.assignedGroups[i].signedDocLink != null
    ) {
      currentFormDocLink = formInstance.assignedGroups[i].signedDocLink;
      console.log('Current: ', currentFormDocLink);
      i++;
    }
    setPdfLink(currentFormDocLink ?? formInstance.formDocLink);
    setFormTemplateName(formInstance.formTemplate.name);
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

  const clearAddedBoxes = async () => {
    const existingPdfBytes = await fetch(pdfLink).then((res) =>
      res.arrayBuffer(),
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    if (fields) {
      fields.forEach((formFields, pageNum) => {
        formFields.forEach((field, index) => {
          form.getFields().forEach((fieldOnForm) => {
            if (fieldOnForm.getName() == field.id) {
              form.removeField(fieldOnForm);
            }
          });
        });
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfLink(url);
    }
  };

  const updatePDF = async () => {
    const existingPdfBytes = await fetch(pdfLink).then((res) =>
      res.arrayBuffer(),
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    fields.forEach((formFields, pageNum) => {
      const page = pdfDoc.getPage(pageNum);
      const { width: pageWidth, height: pageHeight } = page.getSize();

      formFields.forEach(async (field) => {
        const { width, height, x_coordinate: x, y_coordinate: y } = field;
        if (
          formInstance?.formTemplate.pageHeight &&
          formInstance?.formTemplate.pageWidth
        ) {
          const formWidth = formInstance?.formTemplate.pageWidth;
          const formHeight = formInstance?.formTemplate.pageHeight;

          const widthOnPdf = (width * pageWidth) / formWidth;
          const heightOnPdf = (height * pageHeight) / formHeight;
          const xCoordOnPdf = (x * pageWidth) / formWidth;
          const yCoordOnPdf =
            pageHeight - (y * pageHeight) / formHeight - heightOnPdf;

          let fieldToBeAdded: PDFCheckBox | PDFTextField | undefined;
          switch (field.type) {
            //TODO: TEMPORARY
            case 'SIGNATURE':
              const emblemUrl =
                'https://pdf-lib.js.org/assets/mario_emblem.png';
              const emblemImageBytes = await fetch(emblemUrl).then((res) =>
                res.arrayBuffer(),
              );
              const jpgImage = await pdfDoc.embedPng(emblemImageBytes);
              page.drawImage(jpgImage, {
                x: xCoordOnPdf,
                y: yCoordOnPdf,
                width: widthOnPdf,
                height: heightOnPdf,
              });
              break;
            case 'CHECKBOX':
              fieldToBeAdded = form.createCheckBox(field.id);
              fieldToBeAdded.check();
              break;
            case 'TEXT_FIELD':
              fieldToBeAdded = form.createTextField(field.id);
              fieldToBeAdded.setText(field.data.text);
              break;
          }

          if (fieldToBeAdded) {
            fieldToBeAdded.addToPage(page, {
              width: widthOnPdf,
              height: heightOnPdf,
              x: xCoordOnPdf,
              y: yCoordOnPdf,
            });
          }
        }
      });
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfBlob(blob);
    setPdfLink(url);
  };

  return (
    <SignFormInstanceContext.Provider
      value={{
        formId: id,
        formInstanceError,
        isLoading,
        pdfLink,
        formTemplateName,
        fields,
        setFields,
        formInstance,
        groupNumber,
        updateField,
        updatePDF,
        pdfBlob,
        setPdfBlob,
        assignedGroupId,
        clearAddedBoxes,
      }}
    >
      {children}
    </SignFormInstanceContext.Provider>
  );
};
