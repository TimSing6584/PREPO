/*
  Warnings:

  - You are about to drop the column `userId` on the `StarredQuestion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questionId,userKindeId]` on the table `StarredQuestion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdById` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userKindeId` to the `StarredQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('DEFAULT', 'PERSONALIZED');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_createdById_fkey";

-- DropForeignKey
ALTER TABLE "StarredQuestion" DROP CONSTRAINT "StarredQuestion_userId_fkey";

-- DropIndex
DROP INDEX "StarredQuestion_questionId_userId_key";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "type" "QuestionType" NOT NULL,
ALTER COLUMN "createdById" SET NOT NULL;

-- AlterTable
ALTER TABLE "StarredQuestion" DROP COLUMN "userId",
ADD COLUMN     "userKindeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StarredQuestion_questionId_userKindeId_key" ON "StarredQuestion"("questionId", "userKindeId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("kindeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredQuestion" ADD CONSTRAINT "StarredQuestion_userKindeId_fkey" FOREIGN KEY ("userKindeId") REFERENCES "User"("kindeId") ON DELETE RESTRICT ON UPDATE CASCADE;
