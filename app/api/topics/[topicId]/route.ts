import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { roleChecker } from "@/app/utils/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const isAdmin = await roleChecker("admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { topicId } = await params;
    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required." }, { status: 400 });
    }

    const existingTopic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true, deleted: true },
    });

    if (!existingTopic || existingTopic.deleted) {
      return NextResponse.json({ error: "Topic not found." }, { status: 404 });
    }

    await prisma.topic.update({
      where: { id: topicId },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
