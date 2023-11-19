-- AlterTable
ALTER TABLE "FormInstance" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "markedCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "markedCompletedAt" TIMESTAMP(3);
