import { useQuery } from '@tanstack/react-query';
import { formInstancesControllerFindOneOptions } from '@web/client/@tanstack/react-query.gen';
import { Field } from '@web/components/createFormTemplate/types';
import { FormField, SignFormInstanceContextType } from '@web/context/types';
import { useAuth } from '@web/hooks/useAuth';
import { PDFDocument } from 'pdf-lib';
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
  const { userData, user } = useAuth();
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
  });

  const [fields, setFields] = useState<FormField[][]>([]);
  const [groupNumber, setGroupNumber] = useState<number>(0);
  const [pdfLink, setPdfLink] = useState('');
  const [formTemplateName, setFormTemplateName] = useState('');

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
    setPdfLink(formInstance.formDocLink);
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
      console.log('Updated Fields Test: ', updatedFields);
      return updatedFields;
    });
  };
  const updatePDF = async () => {
    const existingPdfBytes = await fetch(pdfLink).then((res) =>
      res.arrayBuffer(),
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    form.getFields().forEach((field) => form.removeField(field));

    fields.forEach((formFields, pageNum) => {
      const page = pdfDoc.getPage(pageNum);
      const { width: pageWidth, height: pageHeight } = page.getSize();

      formFields.forEach((field) => {
        const { width, height, x_coordinate: x, y_coordinate: y } = field;
        switch (field.type) {
          case 'SIGNATURE':
            // EMBED IMAGE
            return;
          case 'CHECKBOX':
            const checkboxField = form.createCheckBox(field.id);
            checkboxField.check();
            checkboxField.addToPage(page, {
              width,
              height,
              x: (x * pageWidth) / 700,
              y: pageHeight - (y * pageHeight) / 900,
            });
            return;
          case 'TEXT_FIELD':
            const textField = form.createTextField(field.id);
            textField.setText(field.data.text);
            textField.addToPage(page, {
              width: (width * pageWidth) / 700,
              height: (height * pageHeight) / 900,
              x: (x * pageWidth) / 700,
              y: pageHeight - (y * pageHeight) / 900,
            });
            return;
        }
      });
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfLink(url);
  };

  return (
    <SignFormInstanceContext.Provider
      value={{
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
      }}
    >
      {children}
    </SignFormInstanceContext.Provider>
  );
};
