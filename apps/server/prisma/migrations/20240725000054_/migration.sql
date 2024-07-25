-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_assignedUserId_fkey";

-- AlterTable
ALTER TABLE "Signature" ALTER COLUMN "assignedUserId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
