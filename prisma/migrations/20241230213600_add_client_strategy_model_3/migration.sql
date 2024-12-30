/*
  Warnings:

  - Added the required column `clientId` to the `ClientStrategy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "strategyId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ClientStrategy" ADD COLUMN     "clientId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ClientStrategy" ADD CONSTRAINT "ClientStrategy_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
