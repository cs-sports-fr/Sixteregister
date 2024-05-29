-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('Waiting', 'PrincipalList', 'Validated');

-- CreateEnum
CREATE TYPE "EnumUserStatus" AS ENUM ('UserStatus', 'AdminStatus', 'SuperAdminStatus');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('F', 'M', 'preferNotToSay');

-- CreateEnum
CREATE TYPE "mailClient" AS ENUM ('SES', 'MailGun');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed', 'Canceled', 'Forged', 'Expired');

-- CreateTable
CREATE TABLE "Sport" (
    "id" INTEGER NOT NULL,
    "sport" TEXT NOT NULL,
    "nbPlayersMin" INTEGER NOT NULL DEFAULT 1,
    "nbPlayersMax" INTEGER NOT NULL DEFAULT 300,
    "isCollective" BOOLEAN NOT NULL DEFAULT true,
    "nbOfTeams" INTEGER NOT NULL DEFAULT 64,

    CONSTRAINT "Sport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TeamStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sportId" INTEGER NOT NULL,
    "teamAdminUserId" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "amountPaidInCents" INTEGER NOT NULL DEFAULT 0,
    "amountToPayInCents" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "status" "EnumUserStatus" NOT NULL DEFAULT 'UserStatus',
    "sportAdminId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" SERIAL NOT NULL,
    "gender" "Gender" NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "charteIsValidated" BOOLEAN NOT NULL,
    "chartePassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCaptain" BOOLEAN NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "charteEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "certificateOK" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralConfig" (
    "id" SERIAL NOT NULL,
    "editionYear" INTEGER NOT NULL,
    "isRegistrationOpen" BOOLEAN NOT NULL,
    "isPaymentOpen" BOOLEAN NOT NULL,
    "canSendEmails" BOOLEAN NOT NULL DEFAULT true,
    "expectedRegistrationDate" TIMESTAMP(3) NOT NULL,
    "mailClient" "mailClient" NOT NULL DEFAULT 'SES',

    CONSTRAINT "GeneralConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amountInCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "requestId" TEXT,
    "requestUuid" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_email_key" ON "Participant"("email");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_teamAdminUserId_fkey" FOREIGN KEY ("teamAdminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_sportAdminId_fkey" FOREIGN KEY ("sportAdminId") REFERENCES "Sport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
