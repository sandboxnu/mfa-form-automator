/*
  Warnings:

  - You are about to drop the column `assignedUserId` on the `Signature` table. All the data in the column will be lost.
  - You are about to drop the `_AssignedUserList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedUserList" DROP CONSTRAINT "_AssignedUserList_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignedUserList" DROP CONSTRAINT "_AssignedUserList_B_fkey";

-- AlterTable
ALTER TABLE "Signature" DROP COLUMN "assignedUserId",
ADD COLUMN     "employeeId" UUID,
ADD COLUMN     "signerEmployeeId" UUID,
ADD COLUMN     "signingEmployeeId" UUID;

-- DropTable
DROP TABLE "_AssignedUserList";

-- CreateTable
CREATE TABLE "_signerEmployeeList" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_signerEmployeeList_AB_unique" ON "_signerEmployeeList"("A", "B");

-- CreateIndex
CREATE INDEX "_signerEmployeeList_B_index" ON "_signerEmployeeList"("B");

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_signerEmployeeId_fkey" FOREIGN KEY ("signerEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_signingEmployeeId_fkey" FOREIGN KEY ("signingEmployeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_signerEmployeeList" ADD CONSTRAINT "_signerEmployeeList_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_signerEmployeeList" ADD CONSTRAINT "_signerEmployeeList_B_fkey" FOREIGN KEY ("B") REFERENCES "Signature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
