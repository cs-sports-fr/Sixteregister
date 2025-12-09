/*
  Warnings:

  - You are about to drop the column `ValidateBoursier` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `isBoursier` on the `Participant` table. All the data in the column will be lost.
  - Added the required column `licenceID` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packId` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TiebreakerCriterion" AS ENUM ('TournamentPoints', 'GoalDifference', 'GoalsScored', 'GoalsConceded', 'HeadToHead', 'FairPlay', 'MatchesWon');

-- CreateEnum
CREATE TYPE "ClassementTennis" AS ENUM ('NC', 'C40', 'C305', 'C304', 'C303', 'C302', 'C301', 'C30', 'C155', 'C154', 'C153', 'C152', 'C151', 'C15', 'C56', 'C46', 'C36', 'C26', 'C16', 'C0');

-- CreateEnum
CREATE TYPE "ArmeEscrime" AS ENUM ('Sabre', 'Epee', 'Fleuret');

-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('Logement', 'Tournoi', 'VT', 'RestaurationSoir', 'Restau', 'Acti', 'ArretBus', 'RestaurationMidi');

-- CreateEnum
CREATE TYPE "PhaseType" AS ENUM ('Roundof64', 'Roundof32', 'Roundof16', 'GroupStage', 'QuarterFinal', 'SemiFinal', 'ThirdPlace', 'Final');

-- CreateEnum
CREATE TYPE "MedalType" AS ENUM ('Gold', 'Silver', 'Bronze');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TeamStatus" ADD VALUE 'Incomplete';
ALTER TYPE "TeamStatus" ADD VALUE 'Awaitingauthorization';

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "ValidateBoursier",
DROP COLUMN "isBoursier",
ADD COLUMN     "armeVoeu1" "ArmeEscrime",
ADD COLUMN     "armeVoeu2" "ArmeEscrime",
ADD COLUMN     "armeVoeu3" "ArmeEscrime",
ADD COLUMN     "cautionOK" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "certificateLink" TEXT,
ADD COLUMN     "certificateOK" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "classementTT" DOUBLE PRECISION,
ADD COLUMN     "classementTennis" "ClassementTennis",
ADD COLUMN     "convocationLink" TEXT,
ADD COLUMN     "hasAllergies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heuredejdimanche" TEXT,
ADD COLUMN     "heuredejsamedi" TEXT,
ADD COLUMN     "heuredinersamedi" TEXT,
ADD COLUMN     "heurepetitdejdimanche" TEXT,
ADD COLUMN     "heurepetitdejsamedi" TEXT,
ADD COLUMN     "isVegan" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "licenceID" TEXT NOT NULL,
ADD COLUMN     "lieudejdimancheId" INTEGER,
ADD COLUMN     "lieudejsamediId" INTEGER,
ADD COLUMN     "lieudinersamediId" INTEGER,
ADD COLUMN     "lieupetitdejdimancheId" INTEGER,
ADD COLUMN     "lieupetitdejsamediId" INTEGER,
ADD COLUMN     "lieutenteId" INTEGER,
ADD COLUMN     "logementRezOk" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mailHebergeur" TEXT,
ADD COLUMN     "mobile" TEXT NOT NULL DEFAULT '0656563425',
ADD COLUMN     "navettedimanchealler" TEXT,
ADD COLUMN     "navettedimancheretour" TEXT,
ADD COLUMN     "navettesamedialler" TEXT,
ADD COLUMN     "navettesamediretour" TEXT,
ADD COLUMN     "numerotente" TEXT,
ADD COLUMN     "packId" INTEGER NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL DEFAULT '230803',
ADD COLUMN     "raceTimeSeconds" DOUBLE PRECISION,
ADD COLUMN     "status" "EnumUserStatus" NOT NULL DEFAULT 'UserStatus',
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "isCautionPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDeleg" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isInIDF" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "pictureLink" TEXT;

-- AlterTable
ALTER TABLE "Sport" ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Sport description',
ADD COLUMN     "description2" TEXT NOT NULL DEFAULT 'Sport description 2',
ADD COLUMN     "imageLink" TEXT NOT NULL DEFAULT 'http://toss-images.s3.eu-west-3.amazonaws.com/sports/foot.jpeg',
ADD COLUMN     "pointsperdefeat" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pointsperdraw" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pointsperwin" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "poolMatchLength" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "startTimeSunday" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tiebreakerOrder" "TiebreakerCriterion"[] DEFAULT ARRAY['HeadToHead', 'GoalsConceded', 'FairPlay', 'TournamentPoints', 'GoalsScored', 'GoalDifference', 'MatchesWon']::"TiebreakerCriterion"[];

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "goalDifference" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalsConceded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalsScored" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isConvocationGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSelectedforKnockoutStage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "level" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "poolmatchesdraw" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "poolmatcheslost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "poolmatcheswon" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tournamentPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "Type" "PlaceType" NOT NULL DEFAULT 'Logement',
    "sportSaturdayId" INTEGER,
    "sportSundayId" INTEGER,
    "numberOfFields" INTEGER NOT NULL DEFAULT 2,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTimeAfternoon" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startTimeSunday" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isBreakfast" BOOLEAN NOT NULL DEFAULT false,
    "isLunch" BOOLEAN NOT NULL DEFAULT false,
    "isDinner" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sportId" INTEGER NOT NULL,
    "isMorning" BOOLEAN NOT NULL DEFAULT false,
    "PlaceId" INTEGER,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "phase" "PhaseType" NOT NULL,
    "teamOneId" INTEGER,
    "teamTwoId" INTEGER,
    "teamOneSource" TEXT,
    "teamTwoSource" TEXT,
    "scoreTeamOne" INTEGER,
    "scoreTeamTwo" INTEGER,
    "matchTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "winnerId" INTEGER,
    "isScheduled" BOOLEAN NOT NULL DEFAULT true,
    "hasStarted" BOOLEAN NOT NULL DEFAULT false,
    "hasEnded" BOOLEAN NOT NULL DEFAULT false,
    "field" INTEGER NOT NULL,
    "placeId" INTEGER,
    "sportId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL DEFAULT 0,
    "isAllowedInIDF" BOOLEAN NOT NULL DEFAULT true,
    "isBreakfastIncluded" BOOLEAN NOT NULL DEFAULT false,
    "isLunchIncluded" BOOLEAN NOT NULL DEFAULT false,
    "isDinnerIncluded" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "pictureLink" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medal" (
    "id" SERIAL NOT NULL,
    "type" "MedalType" NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "sportId" INTEGER NOT NULL,

    CONSTRAINT "Medal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParticipantToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TeamPools" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MatchToParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantToProduct_AB_unique" ON "_ParticipantToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantToProduct_B_index" ON "_ParticipantToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamPools_AB_unique" ON "_TeamPools"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamPools_B_index" ON "_TeamPools"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MatchToParticipant_AB_unique" ON "_MatchToParticipant"("A", "B");

-- CreateIndex
CREATE INDEX "_MatchToParticipant_B_index" ON "_MatchToParticipant"("B");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_sportSaturdayId_fkey" FOREIGN KEY ("sportSaturdayId") REFERENCES "Sport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_sportSundayId_fkey" FOREIGN KEY ("sportSundayId") REFERENCES "Sport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_lieutenteId_fkey" FOREIGN KEY ("lieutenteId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_lieupetitdejsamediId_fkey" FOREIGN KEY ("lieupetitdejsamediId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_lieudejsamediId_fkey" FOREIGN KEY ("lieudejsamediId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_lieudinersamediId_fkey" FOREIGN KEY ("lieudinersamediId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_lieupetitdejdimancheId_fkey" FOREIGN KEY ("lieupetitdejdimancheId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_lieudejdimancheId_fkey" FOREIGN KEY ("lieudejdimancheId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pool" ADD CONSTRAINT "Pool_PlaceId_fkey" FOREIGN KEY ("PlaceId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pool" ADD CONSTRAINT "Pool_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamOneId_fkey" FOREIGN KEY ("teamOneId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamTwoId_fkey" FOREIGN KEY ("teamTwoId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medal" ADD CONSTRAINT "Medal_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medal" ADD CONSTRAINT "Medal_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToProduct" ADD CONSTRAINT "_ParticipantToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantToProduct" ADD CONSTRAINT "_ParticipantToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamPools" ADD CONSTRAINT "_TeamPools_A_fkey" FOREIGN KEY ("A") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamPools" ADD CONSTRAINT "_TeamPools_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchToParticipant" ADD CONSTRAINT "_MatchToParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MatchToParticipant" ADD CONSTRAINT "_MatchToParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
