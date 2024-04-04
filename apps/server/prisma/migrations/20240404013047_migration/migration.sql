/*
  Warnings:

  - You are about to drop the column `userSignedById` on the `Signature` table. All the data in the column will be lost.
  - Added the required column `assignedUserId` to the `Signature` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_signerPositionId_fkey";

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_userSignedById_fkey";

-- AlterTable
ALTER TABLE "Signature" DROP COLUMN "userSignedById",
ADD COLUMN     "assignedUserId" UUID NOT NULL,
ALTER COLUMN "signerPositionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_signerPositionId_fkey" FOREIGN KEY ("signerPositionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
