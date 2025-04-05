/*
  Warnings:

  - Added the required column `pageHeight` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageWidth` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page` to the `TemplateBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignedGroup" ALTER COLUMN "signedDocLink" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FormTemplate" ADD COLUMN     "pageHeight" INTEGER NOT NULL,
ADD COLUMN     "pageWidth" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TemplateBox" ADD COLUMN     "page" INTEGER NOT NULL;
