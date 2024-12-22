/*
  Warnings:

  - You are about to drop the column `endDate` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Program` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "endDate",
DROP COLUMN "startDate";
