/*
  Warnings:

  - Added the required column `height` to the `TemplateBox` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `TemplateBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateBox" ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
