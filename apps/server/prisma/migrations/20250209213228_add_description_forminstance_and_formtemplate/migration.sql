-- AlterTable
ALTER TABLE "FormInstance" ADD COLUMN     "description" VARCHAR(255) NOT NULL DEFAULT 'No description';

-- AlterTable
ALTER TABLE "FormTemplate" ADD COLUMN     "description" VARCHAR(255) NOT NULL DEFAULT 'No description';
