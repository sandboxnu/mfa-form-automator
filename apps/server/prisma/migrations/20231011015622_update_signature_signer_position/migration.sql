/*
  Warnings:

  - Made the column `signerPositionId` on table `Signature` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_signerPositionId_fkey";

-- AlterTable
ALTER TABLE "Signature" ALTER COLUMN "signerPositionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_signerPositionId_fkey" FOREIGN KEY ("signerPositionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
