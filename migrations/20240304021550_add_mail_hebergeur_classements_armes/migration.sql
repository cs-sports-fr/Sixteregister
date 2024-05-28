-- CreateEnum
CREATE TYPE "ClassementTennis" AS ENUM ('NC', 'C40', 'C305', 'C304', 'C303', 'C302', 'C301', 'C30', 'C155', 'C154', 'C153', 'C152', 'C151', 'C15', 'C56', 'C46', 'C36', 'C26', 'C16', 'C0');

-- CreateEnum
CREATE TYPE "ArmeEscrime" AS ENUM ('Sabre', 'Epee', 'Fleuret');

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "armevoeu1" "ArmeEscrime" ,
ADD COLUMN     "armevoeu2" "ArmeEscrime" ,
ADD COLUMN     "armevoeu3" "ArmeEscrime" ,
ADD COLUMN     "classementTT" DOUBLE PRECISION ,
ADD COLUMN     "classementTennis" "ClassementTennis" ,
ADD COLUMN     "mailhebergeur" TEXT;
