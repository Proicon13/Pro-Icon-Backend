/*
  Warnings:

  - Added the required column `hertez` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pulse` to the `Program` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "hertez" INTEGER NOT NULL,
ADD COLUMN     "pulse" INTEGER NOT NULL;
