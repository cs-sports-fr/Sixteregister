/*
  Warnings:

  - You are about to drop the `_PackToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PackToProduct" DROP CONSTRAINT "_PackToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_PackToProduct" DROP CONSTRAINT "_PackToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "hasAllergies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVegan" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Sport" ADD COLUMN     "isCollective" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "nbOfTeams" INTEGER NOT NULL DEFAULT 64,
ADD COLUMN     "nbPlayersMax" INTEGER NOT NULL DEFAULT 300,
ADD COLUMN     "nbPlayersMin" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "_PackToProduct";

-- CreateTable
CREATE TABLE "GeneralConfig" (
    "id" SERIAL NOT NULL,
    "editionYear" INTEGER NOT NULL,
    "isRegistrationOpen" BOOLEAN NOT NULL,
    "isPaymentOpen" BOOLEAN NOT NULL,

    CONSTRAINT "GeneralConfig_pkey" PRIMARY KEY ("id")
);
