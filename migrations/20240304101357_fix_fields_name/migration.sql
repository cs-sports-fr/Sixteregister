/*
  Warnings:

  - You are about to drop the column `armevoeu1` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `armevoeu2` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `armevoeu3` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `mailhebergeur` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "armevoeu1",
DROP COLUMN "armevoeu2",
DROP COLUMN "armevoeu3",
DROP COLUMN "mailhebergeur",
ADD COLUMN     "armeVoeu1" "ArmeEscrime",
ADD COLUMN     "armeVoeu2" "ArmeEscrime",
ADD COLUMN     "armeVoeu3" "ArmeEscrime",
ADD COLUMN     "mailHebergeur" TEXT;
