/*
  Warnings:

  - Added the required column `expectedRegistrationDate` to the `GeneralConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneralConfig" ADD COLUMN     "expectedRegistrationDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "isAllowedInIDF" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "certificateLink" TEXT;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "isInIDF" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sportAdminId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sportAdminId_fkey" FOREIGN KEY ("sportAdminId") REFERENCES "Sport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
