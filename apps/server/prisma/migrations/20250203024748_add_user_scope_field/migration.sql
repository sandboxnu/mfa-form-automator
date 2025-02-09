/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `Employee` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EmployeeScope" AS ENUM ('BASE_USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "isAdmin",
ADD COLUMN     "scope" "EmployeeScope" NOT NULL DEFAULT 'BASE_USER';
