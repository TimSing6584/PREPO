/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Topic_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Topic_name_key" ON "Topic"("name") WHERE (deleted = false);
