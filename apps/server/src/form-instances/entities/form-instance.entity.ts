import { FormInstance } from "@prisma/client";

export class FormInstanceEntity implements FormInstance {
  // placeholder
  id: string;
  name: string;
  formDocLink: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  originatorId: string;
  formTemplateId: string;
}
