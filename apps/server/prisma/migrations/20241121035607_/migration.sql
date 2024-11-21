/*
  Warnings:

  - You are about to drop the column `formDocLink` on the `FormInstance` table. All the data in the column will be lost.
  - You are about to drop the column `formDocLink` on the `FormTemplate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documentId]` on the table `FormTemplate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documentId` to the `FormInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentId` to the `FormTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FormInstance" DROP COLUMN "formDocLink",
ADD COLUMN     "documentId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "FormTemplate" DROP COLUMN "formDocLink",
ADD COLUMN     "documentId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "byteData" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormTemplate_documentId_key" ON "FormTemplate"("documentId");

-- AddForeignKey
ALTER TABLE "FormInstance" ADD CONSTRAINT "FormInstance_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormTemplate" ADD CONSTRAINT "FormTemplate_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
