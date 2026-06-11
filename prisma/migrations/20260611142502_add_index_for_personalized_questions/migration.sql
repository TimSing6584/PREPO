-- CreateIndex
CREATE INDEX "Question_default_by_topic_idx" ON "Question"("topicId", "type", "deleted", "createdAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Question_personalized_by_user_topic_idx" ON "Question"("topicId", "createdById", "type", "deleted", "createdAt" DESC, "id" DESC);
