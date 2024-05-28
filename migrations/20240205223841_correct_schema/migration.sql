/*
  Warnings:

  - You are about to drop the column `productId` on the `Pack` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_participantId_fkey";

-- DropIndex
DROP INDEX "User_participantId_key";

-- AlterTable
ALTER TABLE "Pack" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "participantId";
