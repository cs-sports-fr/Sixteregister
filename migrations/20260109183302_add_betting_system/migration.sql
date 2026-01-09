-- CreateEnum
CREATE TYPE "BetPrediction" AS ENUM ('TeamOne', 'TeamTwo', 'Draw');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "bettingClosedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "betPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "participantId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "predictedWinner" "BetPrediction" NOT NULL,
    "predictedScoreTeamOne" INTEGER,
    "predictedScoreTeamTwo" INTEGER,
    "oddsSnapshotTeamOne" DOUBLE PRECISION,
    "oddsSnapshotTeamTwo" DOUBLE PRECISION,
    "oddsSnapshotDraw" DOUBLE PRECISION,
    "pointsWon" INTEGER NOT NULL DEFAULT 0,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "isCorrect" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bet_participantId_matchId_key" ON "Bet"("participantId", "matchId");

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
