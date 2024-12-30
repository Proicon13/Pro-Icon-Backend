/*
  Warnings:

  - A unique constraint covering the columns `[strategyId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TrainingType" AS ENUM ('STATIC', 'DYNAMIC', 'POWER');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "strategyId" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ClientStrategy" (
    "id" SERIAL NOT NULL,
    "trainingType" "TrainingType" NOT NULL DEFAULT 'STATIC',
    "targetWeight" DOUBLE PRECISION,
    "muclesMass" DOUBLE PRECISION,
    "boudyFatMass" DOUBLE PRECISION,

    CONSTRAINT "ClientStrategy_pkey" PRIMARY KEY ("id")
);

