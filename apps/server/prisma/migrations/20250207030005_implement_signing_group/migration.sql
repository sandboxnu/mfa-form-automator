/*
  Warnings:

  - You are about to drop the `Signature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SignatureField` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SignatureBoxFieldType" AS ENUM ('SIGNATURE', 'CHECKBOX');

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_formInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_signerDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_signerEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_signerPositionId_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_signingEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "SignatureField" DROP CONSTRAINT "SignatureField_formTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "_signerEmployeeList" DROP CONSTRAINT "_signerEmployeeList_A_fkey";

-- DropForeignKey
ALTER TABLE "_signerEmployeeList" DROP CONSTRAINT "_signerEmployeeList_B_fkey";

-- DropTable
DROP TABLE "Signature";

-- DropTable
DROP TABLE "SignatureField";

-- CreateTable
CREATE TABLE "FieldGroup" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "formTemplateId" UUID NOT NULL,

    CONSTRAINT "FieldGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateBox" (
    "id" UUID NOT NULL,
    "type" "SignatureBoxFieldType" NOT NULL,
    "x_coordinate" INTEGER NOT NULL,
    "y_coordinate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fieldGroupId" UUID NOT NULL,

    CONSTRAINT "TemplateBox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignedGroup" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "signed" BOOLEAN NOT NULL DEFAULT false,
    "signedDocLink" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "signerPositionId" UUID,
    "signerDepartmentId" UUID,
    "signerEmployeeId" UUID,
    "signingEmployeeId" UUID,
    "signerType" "SignerType" NOT NULL,
    "formInstanceId" UUID NOT NULL,
    "fieldGroupId" UUID NOT NULL,

    CONSTRAINT "AssignedGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstanceBox" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignedGroupId" UUID NOT NULL,
    "templateBoxId" UUID NOT NULL,

    CONSTRAINT "InstanceBox_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FieldGroup" ADD CONSTRAINT "FieldGroup_formTemplateId_fkey" FOREIGN KEY ("formTemplateId") REFERENCES "FormTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateBox" ADD CONSTRAINT "TemplateBox_fieldGroupId_fkey" FOREIGN KEY ("fieldGroupId") REFERENCES "FieldGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGroup" ADD CONSTRAINT "AssignedGroup_signerPositionId_fkey" FOREIGN KEY ("signerPositionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGroup" ADD CONSTRAINT "AssignedGroup_signerDepartmentId_fkey" FOREIGN KEY ("signerDepartmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGroup" ADD CONSTRAINT "AssignedGroup_signerEmployeeId_fkey" FOREIGN KEY ("signerEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGroup" ADD CONSTRAINT "AssignedGroup_signingEmployeeId_fkey" FOREIGN KEY ("signingEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGroup" ADD CONSTRAINT "AssignedGroup_formInstanceId_fkey" FOREIGN KEY ("formInstanceId") REFERENCES "FormInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedGroup" ADD CONSTRAINT "AssignedGroup_fieldGroupId_fkey" FOREIGN KEY ("fieldGroupId") REFERENCES "FieldGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstanceBox" ADD CONSTRAINT "InstanceBox_assignedGroupId_fkey" FOREIGN KEY ("assignedGroupId") REFERENCES "AssignedGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstanceBox" ADD CONSTRAINT "InstanceBox_templateBoxId_fkey" FOREIGN KEY ("templateBoxId") REFERENCES "TemplateBox"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_signerEmployeeList" ADD CONSTRAINT "_signerEmployeeList_A_fkey" FOREIGN KEY ("A") REFERENCES "AssignedGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_signerEmployeeList" ADD CONSTRAINT "_signerEmployeeList_B_fkey" FOREIGN KEY ("B") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
