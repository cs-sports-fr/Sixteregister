/*
  Warnings:

  - You are about to drop the column `certificateOK` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "certificateOK",
ADD COLUMN     "isBoursier" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
CREATE SEQUENCE sport_id_seq;
ALTER TABLE "Sport" ALTER COLUMN "id" SET DEFAULT nextval('sport_id_seq');
ALTER SEQUENCE sport_id_seq OWNED BY "Sport"."id";
