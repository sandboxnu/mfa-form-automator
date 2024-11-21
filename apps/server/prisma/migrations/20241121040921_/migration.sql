-- DropForeignKey
ALTER TABLE "FormInstance" DROP CONSTRAINT "FormInstance_documentId_fkey";

-- DropForeignKey
ALTER TABLE "FormTemplate" DROP CONSTRAINT "FormTemplate_documentId_fkey";

-- AlterTable
ALTER TABLE "FormInstance" ALTER COLUMN "documentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FormTemplate" ALTER COLUMN "documentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FormInstance" ADD CONSTRAINT "FormInstance_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormTemplate" ADD CONSTRAINT "FormTemplate_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
