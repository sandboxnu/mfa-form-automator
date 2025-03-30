/*
  Warnings:

  - Added the required column `page` to the `TemplateBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TemplateBox" ADD COLUMN     "page" INTEGER NOT NULL;
