import { useMutation, useQuery } from '@tanstack/react-query';
import {
  formInstancesControllerCompleteFormInstanceMutation,
  formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey,
  formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey,
  formInstancesControllerFindAllQueryKey,
  formInstancesControllerFindOneOptions,
  formInstancesControllerSignFormInstanceMutation,
} from '@web/client/@tanstack/react-query.gen';
import {
  ApproveFormInstanceContextType,
  ContextAssignedGroupData,
  FormField,
} from '@web/context/types';
import { useAuth } from '@web/hooks/useAuth';
import { queryClient } from '@web/pages/_app';
import { getLatestSignedFormLink } from '@web/utils/formInstanceUtils';
import { groupRgbColors } from '@web/utils/formTemplateUtils';
import { useRouter } from 'next/router';
import { PDFCheckBox, PDFDocument, PDFTextField, rgb } from 'pdf-lib';
import React, { createContext, useEffect, useState } from 'react';

export const ApproveFormInstanceContext =
  createContext<ApproveFormInstanceContextType>(
    {} as ApproveFormInstanceContextType,
  );

export const ApproveFormInstanceProvider = ({
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
  const [assignedGroupData, setAssignedGroupData] =
    useState<ContextAssignedGroupData>();
    
  const completeFormInstanceMutation = useMutation({
    ...formInstancesControllerCompleteFormInstanceMutation(),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: formInstancesControllerFindAllQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey:
          formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey(),
      });
      router.push('/completed').then(() => {});
    },
  });

  const handleApproveFormInstance = async () => {
    await completeFormInstanceMutation.mutateAsync({
      path: {
        formInstanceId: id,
      },
    });
  };
  const [fields, setFields] = useState<FormField[][]>([]);
  const [groupNumber, setGroupNumber] = useState<number>(0);
  const [previewPdfLink, setPreviewPdfLink] = useState('');
  const [completedPdfLink, setCompletedPdfLink] = useState('');
  const [completedPdf, setCompletedPdf] = useState<ArrayBuffer | null>(null);
  const [previewPdf, setPreviewPdf] = useState<ArrayBuffer | null>(null);
  const router = useRouter();

  // Fetch PDF data when links change
  useEffect(() => {
    const fetchPdfs = async () => {
      if (completedPdfLink) {
        const origPdf = await fetch(completedPdfLink).then((res) =>
          res.arrayBuffer(),
        );
        setCompletedPdf(origPdf);
      }
      if (previewPdfLink) {
        const modPdf = await fetch(previewPdfLink).then((res) =>
          res.arrayBuffer(),
        );
        setPreviewPdf(modPdf);
      }
    };

    fetchPdfs();
  }, [completedPdfLink, previewPdfLink]);

  const modifyPdf = async () => {
    if (previewPdf) {
      const pdfDoc = await PDFDocument.load(previewPdf);

      const form = pdfDoc.getForm();

      formInstance?.assignedGroups.forEach((assignedGroup) => {
        assignedGroup.fieldGroup.templateBoxes.forEach((templateBox) => {
          const {
            width,
            page: pageNum,
            height,
            x_coordinate: x,
            y_coordinate: y,
          } = templateBox;
          const page = pdfDoc.getPage(pageNum);
          const { width: pageWidth, height: pageHeight } = page.getSize();

          if (formInstance) {
            const formWidth = formInstance.formTemplate.pageWidth;
            const formHeight = formInstance.formTemplate.pageHeight;

            const widthOnPdf = (width * pageWidth) / formWidth;
            const heightOnPdf = (height * pageHeight) / formHeight;
            const xCoordOnPdf = (x * pageWidth) / formWidth;
            const yCoordOnPdf =
              pageHeight - (y * pageHeight) / formHeight - heightOnPdf;

            try {
              switch (templateBox.type) {
                case 'CHECKBOX':
                  const checkbox = form.getCheckBox(templateBox.id);
                  checkbox.addToPage(page, {
                    width: widthOnPdf,
                    height: heightOnPdf,
                    x: xCoordOnPdf,
                    y: yCoordOnPdf,
                    borderColor: groupRgbColors[assignedGroup.order][1],
                  });
                  break;
                case 'TEXT_FIELD':
                  const textField = form.getTextField(templateBox.id);
                  textField.addToPage(page, {
                    width: widthOnPdf,
                    height: heightOnPdf,
                    x: xCoordOnPdf,
                    y: yCoordOnPdf,
                    borderColor: groupRgbColors[assignedGroup.order][1],
                  });
                  break;
                default:
                  break;
              }
            } catch (error) {
              console.log('ID does not match: ', error);
            }
          }
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPreviewPdfLink(url);
    }
  };
  useEffect(() => {
    if (!formInstance || formInstanceError) return;

    const getFields = () => {
      const assignedGroups = formInstance.assignedGroups;
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
    const pdfLink = getLatestSignedFormLink(formInstance);
    setCompletedPdfLink(pdfLink);
  }, [
    formInstance,
    formInstanceError,
    user?.departmentId,
    user?.id,
    user?.positionId,
  ]);

  const submitPdf = async (submitLink: string, pdfDoc: PDFDocument) => {
    const form = pdfDoc.getForm();
    form.getFields().forEach((fieldOnForm) => {
      fieldOnForm.disableReadOnly();
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  };

  const nextApproveFormPage = async (
    submitLink: string,
    isReviewPage: boolean,
  ) => {
    const existingPdfBytes = !isReviewPage ? completedPdf : previewPdf;

    if (existingPdfBytes) {
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      if (isReviewPage) {
        modifyPdf();
      } else {
        submitPdf(submitLink, pdfDoc);
      }
    }
  };

  return (
    <ApproveFormInstanceContext.Provider
      value={{
        formInstanceError,
        isLoading,
        originalPdfLink: completedPdfLink,
        modifiedPdfLink: previewPdfLink,
        fields,
        formInstance,
        groupNumber,
        nextApproveFormPage,
        signFormInstanceLoading: isLoading,
      }}
    >
      {children}
    </ApproveFormInstanceContext.Provider>
  );
};
