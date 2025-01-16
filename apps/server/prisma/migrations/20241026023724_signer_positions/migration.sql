/*
  Warnings:

  - You are about to drop the column `signerPositionId` on the `SignatureField` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,departmentId]` on the table `Position` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signerType` to the `Signature` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SignerType" AS ENUM ('POSITION', 'DEPARTMENT', 'USER');

-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_signerPositionId_fkey";

-- DropForeignKey
ALTER TABLE "SignatureField" DROP CONSTRAINT "SignatureField_signerPositionId_fkey";

-- AlterTable
ALTER TABLE "Signature" ADD COLUMN     "signerDepartmentId" UUID,
ADD COLUMN     "signerType" "SignerType" NOT NULL,
ALTER COLUMN "signerPositionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SignatureField" DROP COLUMN "signerPositionId";

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Position_name_departmentId_key" ON "Position"("name", "departmentId");

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_signerPositionId_fkey" FOREIGN KEY ("signerPositionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_signerDepartmentId_fkey" FOREIGN KEY ("signerDepartmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
