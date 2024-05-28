/*
  Warnings:

  - Added the required column `mailClient` to the `GeneralConfig` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "mailClient" AS ENUM ('SES', 'MailGun');

-- AlterTable
ALTER TABLE "GeneralConfig"
ADD COLUMN "mailClient" "mailClient" NOT NULL DEFAULT 'SES';
