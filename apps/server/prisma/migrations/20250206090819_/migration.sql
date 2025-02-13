/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Signature` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_employeeId_fkey";

-- AlterTable
ALTER TABLE "Signature" DROP COLUMN "employeeId";
