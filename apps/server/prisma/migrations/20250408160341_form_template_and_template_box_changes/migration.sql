/*
  Warnings:

  - Added the required column `pageHeight` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageWidth` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `TemplateBox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page` to the `TemplateBox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `TemplateBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssignedGroup" ALTER COLUMN "signedDocLink" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "FormTemplate" ADD COLUMN     "pageHeight" INTEGER NOT NULL,
ADD COLUMN     "pageWidth" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TemplateBox" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "page" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
