/*
  Warnings:

  - You are about to drop the column `birthdate` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "birthdate",
ADD COLUMN     "birthDate" TIMESTAMP(3);
