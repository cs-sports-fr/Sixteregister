/*
  Warnings:

  - You are about to drop the column `participantId` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `betPoints` on the `Participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,matchId]` on the table `Bet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Bet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_participantId_fkey";

-- DropIndex
DROP INDEX "Bet_participantId_matchId_key";

-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "participantId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "betPoints";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "betPoints" INTEGER NOT NULL DEFAULT 100;

-- CreateIndex
CREATE UNIQUE INDEX "Bet_userId_matchId_key" ON "Bet"("userId", "matchId");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
