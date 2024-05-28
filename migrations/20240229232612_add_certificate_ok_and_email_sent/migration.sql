-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "certificateOK" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "charteEmailSent" BOOLEAN NOT NULL DEFAULT false;
