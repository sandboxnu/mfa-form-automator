/*
  Warnings:

  - Changed the type of `signed` on the `AssignedGroup` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AssignedGroup" DROP COLUMN "signed",
ADD COLUMN     "signed" TIMESTAMP(3);
