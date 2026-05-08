-- DropForeignKey
ALTER TABLE "StarredQuestion" DROP CONSTRAINT "StarredQuestion_questionId_fkey";

-- AddForeignKey
ALTER TABLE "StarredQuestion" ADD CONSTRAINT "StarredQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
