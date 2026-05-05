-- DropIndex
DROP INDEX "Topic_name_key";

-- CreateIndex
CREATE INDEX "Topic_name_idx" ON "Topic"("name");

-- Create partial unique index for active topics only
CREATE UNIQUE INDEX "Topic_name_active_unique"
ON "Topic" ("name")
WHERE deleted = false;
