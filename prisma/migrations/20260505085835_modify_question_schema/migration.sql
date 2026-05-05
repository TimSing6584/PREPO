/*
  Warnings:

  - You are about to drop the column `type` on the `Question` table. All the data in the column will be lost.
  - Made the column `correctOption` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `correctWritten` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "type",
ALTER COLUMN "correctOption" SET NOT NULL,
ALTER COLUMN "correctWritten" SET NOT NULL;

-- DropEnum
DROP TYPE "QuestionType";
