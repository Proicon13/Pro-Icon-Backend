/*
  Warnings:

  - You are about to drop the column `adminId` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `medicalNotes` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Disease` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Injury` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'TRAINER';

-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_adminId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "adminId",
DROP COLUMN "height",
DROP COLUMN "medicalNotes",
DROP COLUMN "weight",
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE',
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Disease" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Injury" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "belongToId" INTEGER,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Active';

-- CreateTable
CREATE TABLE "ClientInjury" (
    "clientId" INTEGER NOT NULL,
    "injuryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientInjury_pkey" PRIMARY KEY ("clientId","injuryId")
);

-- CreateTable
CREATE TABLE "ClientDisease" (
    "clientId" INTEGER NOT NULL,
    "diseaseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientDisease_pkey" PRIMARY KEY ("clientId","diseaseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disease_name_key" ON "Disease"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Injury_name_key" ON "Injury"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_belongToId_fkey" FOREIGN KEY ("belongToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientInjury" ADD CONSTRAINT "ClientInjury_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientInjury" ADD CONSTRAINT "ClientInjury_injuryId_fkey" FOREIGN KEY ("injuryId") REFERENCES "Injury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDisease" ADD CONSTRAINT "ClientDisease_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientDisease" ADD CONSTRAINT "ClientDisease_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
